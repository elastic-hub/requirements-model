// plugins/model_rules-v1_2.ts
import yaml from 'js-yaml'

export default defineNuxtPlugin((nuxtApp) => {
    type ValidationCriteria = {
        MustSatisfy: string;
        Keyword: string;
        Requirement: {
            CheckFunction: string;
            Items: Array<{
                CheckFunction: string;
                ConformanceRuleId: string;
            }>;
        };
        Condition: Record<string, any>;
        Dependencies: string[];
    };

    type ModelRule = {
        Order: number;
        DatasetType: string;
        DatasetId: string;
        DatasetName: string;
        Condition: object;
        Function: string;
        Reference: string;
        EntityType: string;
        EntityName: string;
        EntityId: string;
        Notes: string;
        ModelVersionIntroduced: string;
        Status: string;
        ModelVersionRemoved: string;
        ApplicabilityCriteria: any[];
        Type: string;
        ValidationCriteria: ValidationCriteria;
    };

    type MRData = {
        Details: {
            MRVersion: string;
        };
        ModelRules: Record<string, ModelRule>;
    };

    type FormattedModelRule = {
        id: string;
        order: number | string;
        datasetType: string;
        datasetId: string;
        datasetName: string;
        function: string;
        reference: string;
        entityType: string;
        entityName: string;
        entityId: string;
        notes: string;
        modelVersionIntroduced: string;
        status: string;
        modelVersionRemoved: string;
        applicabilityCriteria: string[] | string;
        type: string;
        mustSatisfy: string;
        keyword: string;
        checkFunction: string;
        dependencies: string;
        dependencyItem: string;
        dependencyCount: number;
        mrVersion: string;
        hasItems: string;
        itemCount: number;
        condition: string;
        requirement_checkFunction: string;
        requirement_items: string | null;
        condition_checkFunction?: string;
        reqArguments: string;
        conditionArguments: string;
    };

    // Define the function to process MR data
    const filterMR_v1_2 = (mrData: MRData): FormattedModelRule[] => {
        const formattedRules: FormattedModelRule[] = [];

        if (!mrData.ModelRules) return formattedRules;

        Object.entries(mrData.ModelRules).forEach(([ruleId, rule]) => {
            // Create reqArguments - everything from Requirement except CheckFunction
            const reqArguments = rule.ValidationCriteria?.Requirement ?
                Object.fromEntries(
                    Object.entries(rule.ValidationCriteria.Requirement).filter(([key]) => key !== 'CheckFunction')
                ) : {};

            // Convert reqArguments to YAML string representation
            const reqArgumentsString = Object.keys(reqArguments).length > 0
                ? `<pre><code>${yaml.dump(reqArguments)}</code></pre>`
                : 'No Arguments';

            // Create conditionArguments - everything from Condition except CheckFunction
            const conditionArguments = rule.ValidationCriteria?.Condition ?
                Object.fromEntries(
                    Object.entries(rule.ValidationCriteria.Condition).filter(([key]) => key !== 'CheckFunction')
                ) : {};

            // Convert conditionArguments to YAML string representation
            const conditionArgumentsString = Object.keys(conditionArguments).length > 0
                ? `<pre><code>${yaml.dump(conditionArguments)}</code></pre>`
                : 'No Arguments';

            const dependencies = rule.ValidationCriteria?.Dependencies || [];

            // Create a single rule instance instead of variants
            const formattedRule: FormattedModelRule = {
                id: ruleId,
                order: rule.Order !== undefined ? String(rule.Order) : 'No Value',
                datasetType: rule.DatasetType || 'No Value',
                datasetId: rule.DatasetId || 'No Value',
                datasetName: rule.DatasetName || 'No Value',
                function: rule.Function || 'No Value',
                reference: rule.Reference || 'No Value',
                entityType: rule.EntityType || 'No Value',
                entityName: rule.EntityName || 'No Value',
                entityId: rule.EntityId || 'No Value',
                notes: rule.Notes || 'No Notes',
                modelVersionIntroduced: rule.ModelVersionIntroduced || 'No Value',
                status: rule.Status || 'No Value',
                modelVersionRemoved: rule.ModelVersionRemoved || 'No Value',
                applicabilityCriteria: (rule.ApplicabilityCriteria && rule.ApplicabilityCriteria.length > 0)
                    ? rule.ApplicabilityCriteria
                    : 'No Criteria',
                type: rule.Type || 'No Value',
                mustSatisfy: rule.ValidationCriteria?.MustSatisfy || 'No Value',
                keyword: rule.ValidationCriteria?.Keyword || 'No Value',
                checkFunction: rule.ValidationCriteria?.Requirement?.CheckFunction || 'No Value',
                dependencies: dependencies.length > 0 ? dependencies.join(', ') : 'No Dependencies',
                dependencyItem: dependencies.length > 0 ? dependencies.join(', ') : 'No Dependencies',
                dependencyCount: dependencies.length,
                mrVersion: mrData.Details?.MRVersion || 'No Value',
                hasItems: rule.ValidationCriteria?.Requirement?.Items?.length > 0 ? 'YES' : 'NO',
                itemCount: rule.ValidationCriteria?.Requirement?.Items?.length || 0,
                condition: (() => {
                    const conditionObj = rule?.ValidationCriteria?.Condition;
                    if (conditionObj && typeof conditionObj === 'object' && Object.keys(conditionObj).length > 0) {
                        // Check if this is a simple condition object (not nested with Items)
                        const hasSimpleProperties = Object.keys(conditionObj).some(key =>
                            key !== 'Items' && typeof conditionObj[key] !== 'object'
                        );

                        if (hasSimpleProperties) {
                            return Object.entries(conditionObj)
                                .filter(([key, value]) => value !== undefined && key !== 'Items')
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ');
                        }
                    }
                    return 'No Condition';
                })(),
                requirement_checkFunction: rule.ValidationCriteria?.Requirement?.CheckFunction || 'No Check Function',
                reqArguments: reqArgumentsString,
                requirement_items: rule.ValidationCriteria?.Requirement?.Items?.length > 0
                    ? rule.ValidationCriteria.Requirement.Items.map(item =>
                        `CheckFunction: ${item.CheckFunction}, ConformanceRuleId: ${item.ConformanceRuleId}`
                    ).join('\n')
                    : 'No Items',
                condition_checkFunction: rule.ValidationCriteria?.Condition?.CheckFunction || 'No Check Function',
                conditionArguments: conditionArgumentsString,
            };

            formattedRules.push(formattedRule);
        });

        return formattedRules;
    };

    // Provide the function as part of the plugin
    return {
        provide: {
            model_rules_v1_2: filterMR_v1_2
        },
    };
});