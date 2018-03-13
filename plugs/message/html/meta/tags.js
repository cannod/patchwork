var nest = require('depnest')
var { h, computed, map, send } = require('mutant')

exports.gives = nest('message.html.meta')
exports.needs = nest({
  'about.obs.name': 'first',
  'sheet.tags': 'first',
  'tag.obs.messageTags': 'first'
})

exports.create = function (api) {
  return nest('message.html.meta', function tags (msg) {
    if (msg.key) {
      return computed(api.tag.obs.messageTags(msg.key), (tags) => tagCount(msg.key, tags))
    }
  })

  function tagCount (msgId, tags) {
    if (tags.length) {
      return [' ', h('a.tags', {
        title: tagList('Tags', tags),
        href: '#',
        'ev-click': send(displayTags, { msgId, tags })
      }, [`${tags.length} ${tags.length === 1 ? 'tag' : 'tags'}`])]
    }
  }

  function tagList (prefix, ids) {
    const items = map(ids, api.about.obs.name)
    return computed([prefix, items], (prefix, names) => {
      return (prefix ? (prefix + '\n') : '') + names.map((n) => `- ${n}`).join('\n')
    })
  }

  function displayTags ({ msgId, tags }) {
    api.sheet.tags(msgId, tags)
  }
}