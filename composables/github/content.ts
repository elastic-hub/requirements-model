import { Octokit } from '@octokit/core'

export const useGitHubGetContent = async (owner?: string, repo?: string, path?: string, branch?: string): Promise<any | false> => {
    const { githubToken } = useRuntimeConfig().public

    // Use required parameters
    if (!owner || !repo || !path) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Owner, repo, and path are required parameters.',
        })
    }

    const octokit = new Octokit({ auth: githubToken })

    // Use a valid branch name for ref, default to 'main' if not provided
    const validRef = branch && branch !== 'heads' ? branch : 'main';

    
        // Step 1: Check if repository is private
        const repoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
            owner,
            repo,
        })

        const isPrivate = repoResponse.data.private

        // Step 2: Handle different approaches based on repository visibility
        if (isPrivate) {
            // For private repositories, use the contents API with ref parameter
            const contentsResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo,
                path,
                ref: validRef,
            })

            // If the response is an array, it's a directory, not a file
            if (Array.isArray(contentsResponse.data)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'The specified path is a directory, not a file.',
                })
            }

            // Handle both small files (base64 content) and large files (download_url)
            if (contentsResponse.data && contentsResponse.data.type === 'file') {
                let decodedContent
                
                if ('content' in contentsResponse.data && contentsResponse.data.content && contentsResponse.data.encoding === 'base64') {
                    // Small file - decode base64 content
                    const decodedString = atob(contentsResponse.data.content.replace(/\n/g, ''))
                    try {
                        decodedContent = JSON.parse(decodedString)
                    } catch (e) {
                        decodedContent = decodedString
                    }
                } else if (contentsResponse.data.download_url) {
                    // Large file - use download URL
                    const fileResponse = await $fetch(contentsResponse.data.download_url)
                    decodedContent = typeof fileResponse === 'string' ? JSON.parse(fileResponse) : fileResponse
                } else {
                    throw createError({
                        statusCode: 404,
                        statusMessage: 'No content or download URL available for this file.',
                    })
                }
                
                return decodedContent
            } else {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'No file found at the specified path.',
                })
            }
        } else {
            // For public repositories, first try the contents API to check for large files
            const contentsResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo,
                path,
                ref: validRef,
            })

            // If the response is an array, it's a directory, not a file
            if (Array.isArray(contentsResponse.data)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'The specified path is a directory, not a file.',
                })
            }

            // Handle both small files (base64 content) and large files (download_url)
            if (contentsResponse.data && contentsResponse.data.type === 'file') {
                let decodedContent
                
                if ('content' in contentsResponse.data && contentsResponse.data.content && contentsResponse.data.encoding === 'base64') {
                    // Small file - decode base64 content
                    const decodedString = atob(contentsResponse.data.content.replace(/\n/g, ''))
                    try {
                        decodedContent = JSON.parse(decodedString)
                    } catch (e) {
                        decodedContent = decodedString
                    }
                } else if (contentsResponse.data.download_url) {
                    // Large file - use download URL
                    const fileResponse = await $fetch(contentsResponse.data.download_url)
                    decodedContent = typeof fileResponse === 'string' ? JSON.parse(fileResponse) : fileResponse
                } else {
                    throw createError({
                        statusCode: 404,
                        statusMessage: 'No content or download URL available for this file.',
                    })
                }
                
                return decodedContent
            } else {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'No file found at the specified path.',
                })
            }
        }
}
