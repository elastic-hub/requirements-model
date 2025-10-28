// composables/useGitHubTeams.ts
import { Octokit } from '@octokit/core'

export const useGitHubTeamCheck = async (username: string): Promise<string[]> => {
    const { githubToken } = useRuntimeConfig().public
    const { auth } = useAppConfig().middleware
    const { org, team_slug, headers } = auth.github
    const allowed_roles = auth.allowed_roles

    const octokit = new Octokit({ auth: githubToken })
    const activeTeams: string[] = []

    for (const slug of team_slug) {
        try {
            const res = await octokit.request(
                'GET /orgs/{org}/teams/{team_slug}/memberships/{username}',
                {
                    org,
                    team_slug: slug,
                    username,
                    headers,
                }
            )

            if (res.data?.state === 'active') {
                if (!allowed_roles || allowed_roles.includes(slug)) {
                    activeTeams.push(slug)
                }
            }
        } catch (err: any) {
            if (err.status !== 404) {
                throw createError({
                    statusCode: 500,
                    statusMessage: `GitHub API error checking team '${slug}'`,
                })
            }
        }
    }

    return activeTeams
}