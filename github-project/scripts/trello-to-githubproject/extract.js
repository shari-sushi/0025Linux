import 'dotenv/config'

export function extractCard(data) {
    return data.cards.map(function (card) {
        const list = data.lists.find((list) => list.id == card.idList)
        return {
            "name": card.name,
            "shortUrl": card.shortUrl,
            "desc": card.desc,
            "listsName": list.name,
            "labels": card.labels.map(label => label.name)
        }
    })
}
