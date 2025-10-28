import { Octokit } from '@octokit/core'

export const useGitHubCollaboratorCheck = async (username: string) => {
    const { githubToken } = useRuntimeConfig().public
    const { auth } = useAppConfig().middleware
    const { owner, repo, headers } = auth.github

    const octokit = new Octokit({ auth: githubToken })

    try {
        await octokit.request('GET /repos/{owner}/{repo}/collaborators/{username}', {
            owner,
            repo,
            username,
            headers,
        })
        return true
    } catch (err: any) {
        if (err.status === 404) return false
        throw createError({
            statusCode: 500,
            statusMessage: 'GitHub API error (collaborator)',
        })
    }
}
