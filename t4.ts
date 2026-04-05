import { writeFileSync } from 'fs'

// 从 TG 群和 @CxiaoyuN 那里抄过来的
// 目的是为了测试 t4 的效果
// 不是 @d1y 本人的 drpy-node 实例, 所以不要来骚扰我(@d1y)
const t4 = [
  {
    "id": "py_DianYingTanTang",
    "name": "🫐电影天堂(T4)",
    "api": "https://py.doube.eu.org/spider?site=DianYingTanTang",
    "nsfw": false,
  },
  {
    "id": "py_Dm84",
    "name": "🍋动漫巴士(T4)",
    "api": "https://py.doube.eu.org/spider?site=Dm84",
    "nsfw": false,
  },
].map(item => {
  const { id, name, api, nsfw } = item
  return <Iconfig>{
    id,
    name,
    api,
    nsfw,
    type: 1,
    extra: {
      template: "t4",
    }
  }
})

const file = process.argv[2]
writeFileSync(file, JSON.stringify(t4, null, 2))

// ;(async ()=> {
//   const resp: { spiders: Array<{
//     api: string
//     key: string
//     name: string
//     type: 4
//   }> } = await (await fetch("https://learnpython.ggff.net/api/list_spiders")).json()
//   const data = resp.spiders.map(item=> {
//     const { api, key, name } = item
//     return <Iconfig>{
//       id: key,
//       name,
//       api,
//       nsfw: false,
//       type: 1,
//       extra: {
//         template: "t4",
//       }
//     }
//   })
//   const file2 = process.argv[3]
//   writeFileSync(file2, JSON.stringify(data, null, 2))
// })()