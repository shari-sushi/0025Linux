import 'dotenv/config'
import fs from 'fs'
import { extractCard } from './extract.js'
import { transmitIssues } from './createIssue.js'

app()
function app() {
    // 先に１つ目の結果を出力して確認することをおすすめします。
    const dataForIssues = extraxtCards()
    // console.log(dataForIssues)
    makeIssues(dataForIssues)
}

function extraxtCards() {
    const trelloJsonData = JSON.parse(fs.readFileSync("./sample-json/origin.json"))
    return extractCard(trelloJsonData)
}

function makeIssues(dataForIssues) {
    const repository = {
        //   動作確認用のrepository テストで自由に使ってください。
        //   https://github.com/shari-sushi/testaaaaaaaaaaaaa/issues
        //   ※public注意
        "owner": "shari-sushi",
        "name": "testaaaaaaaaaaaaa"

        //  本番時参考 https://github.com/{owner}/{name}
        // "owner" = ""
        // "name" = ""
    }

    // 同じ階層に.envファイルを用意し、GitHubのPersonal Access Tokenを入力してください。
    const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN

    transmitIssues(dataForIssues, repository, githubToken)
}
