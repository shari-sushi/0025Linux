# TrelloからGitHub Projectへ移行手順

## このスクリプトでできること
- Trello → Github issue
    - Card名 → issue のタイトル
    - Lists名, label名 → label
    - Cardのurl, 説明, コメント → 1つめのコメント
    <br/>

※labelは同じ名前がGitHubに無ければ自動生成

## 手動でやること

### 事前準備
1. Trelloのdata用意
    - json形式でエクスポートする。<br/>
        https://support.atlassian.com/trello/docs/exporting-data-from-trello/
    - `sample-json/origin.json`の中身をエクスポートしたjsonに書き換える。

### このスクリプトでやること
1. コードにGitHub repositoryの情報を入力<br/>
  `index.js`の↓部のコメントアウトを解除し、適切なワードを入力する
    ```js
    // "owner" = "" 
    // "name" = ""  
    ``` 
    ↓(テスト用コード)はコメントアウトする
    ```js
    "owner": "shari-sushi",
    "name": "testaaaaaaaaaaaaa"
    ```
1. GitHubにてpersonal access tokenを取得する。
    - `.env`ファイルを用意し、GitHubのpersonal access tokenを入力する。<br/>
        `./sample.env`を参考のこと。
    - 別アカウントのpurivateにissueを作成する場合はそっちでも設定必要
1. 実行
  `scripts/trello-to-githubproject`にて`yarn install`および`yarn start`を実行

### 事後
1. GitHub issueのタグの色付け
1. GithubのissueをlabelごとにProject作成する
