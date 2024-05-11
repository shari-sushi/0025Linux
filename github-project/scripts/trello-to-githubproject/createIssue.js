import { Octokit } from 'octokit';
import 'dotenv/config'

export async function transmitIssues(data, repository, githubToken) {
    const octokit = new Octokit({ auth: githubToken });

    data.forEach(async data => {
        data.labels.push(data.listsName)
        await octokit.rest.issues.create({
            owner: repository.owner,
            repo: repository.name,
            title: data.name,
            body: data.shortUrl + "\n" + data.desc,
            labels: data.labels,
        });
    });
}
