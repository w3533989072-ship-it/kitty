// import { kitty, req, createTestEnv } from 'utils'

export default class Yjbav implements Handle {
  getConfig() {
    return <Iconfig>{
      id: "yjbav",
      name: "一级棒",
      type: 1,
      nsfw: true,
      api: "https://yjb.one"
    }
  }
  async getCategory() {
    const table = [
      {
        "id": "/",
        "text": "首页"
      },
      {
        "id": "21",
        "text": "JUU1JTlCJUJEJUU0JUJBJUE3JUU4JTg3JUFBJUU2JThCJThE"
      },
      {
        "id": "22",
        "text": "JUU3JUJEJTkxJUU3JUJBJUEyJUU0JUI4JUJCJUU2JTkyJUFE"
      },
      {
        "id": "24",
        "text": "JUU4JTg3JUFBJUU2JThCJThEJUU3JUIyJUJFJUU5JTgwJTg5"
      },
      {
        "id": "25",
        "text": "JUU1JTlCJUJEJUU0JUJBJUE3JUU0JUJDJUEwJUU1JUFBJTky"
      },
      {
        "id": "26",
        "text": "JUU2JTk3JUE1JUU2JTlDJUFDJUU2JTk3JUEwJUU3JUEwJTgx"
      },
      {
        "id": "27",
        "text": "JUU2JTk3JUE1JUU2JTlDJUFDJUU2JTlDJTg5JUU3JUEwJTgx"
      },
      {
        "id": "28",
        "text": "JUU2JTlDJTg5JUU3JUEwJTgxJUU3JUIyJUJFJUU5JTgwJTg5"
      },
      {
        "id": "34",
        "text": "JUU0JUJBJTlBJUU2JUI0JUIyJUU3JUIyJUJFJUU5JTgwJTg5"
      },
      {
        "id": "29",
        "text": "JUU1JUIwJThGJUU0JUJDJTk3JUU1JThGJUEzJUU1JTkxJUIz"
      },
      {
        "id": "30",
        "text": "JUU2JUFDJUE3JUU3JUJFJThFJUU3JUIyJUJFJUU5JTgwJTg5"
      },
      {
        "id": "31",
        "text": "JUU2JTg4JTkwJUU0JUJBJUJBJUU1JThBJUE4JUU2JUJDJUFC"
      },
      {
        "id": "32",
        "text": "JUU3JUJCJThGJUU1JTg1JUI4JUU0JUI4JTg5JUU3JUJBJUE3"
      },
      {
        "id": "33",
        "text": "QWklRTYlOTglOEUlRTYlOTglOUY="
      }
    ]
    return table.map(item => {
      const { id, text } = item
      if (id == "/") return item
      const a = atob(text)
      const b = decodeURIComponent(a)
      return { id, text: b }
    })
  }
  async getHome() {
    const cate = env.get("category")
    const page = env.get("page")
    if (cate == "/") {
      const $ = kitty.load(await req(env.baseUrl))
      const titles = $(".category-count").toArray().map(item => {
        return $(item).text().replace("观看更多", "").trim()
      })
      const videos = $(".post-list").toArray().map(item => {
        return $(item).find("div.col-md-2").toArray().map(item => {
          const id = $(item).find("a").attr("href") ?? ""
          const cover = env.baseUrl + ($(item).find("img").attr("data-original") ?? "")
          const title = $(item).find(".entry-title").text().trim()
          const remark = $(item).find(".type-text").text().trim()
          return <IMovie>{ id, title, cover, remark }
        })
      })
      const list = titles.map((title, index) => {
        return <IHomeContentItem>{
          type: "list",
          title,
          videos: videos[index]
        }
      })
      return <IHomeData>{
        type: "complex",
        data: [
          {
            type: "markdown", extra: {
              markdown: `
> 欢迎使用小猫影视(${kitty.VERSION})
> 该源仅做测试使用，不可用于其他用途
> 飞机交流群: https://t.me/catmovie1145
> 小猫其他指南: https://xmpro.netlify.app
`
            }
          },
          ...list
        ]
      }
    }
    const url = `${env.baseUrl}/vodtype/${cate}-${page}/`
    const $ = kitty.load(await req(url))
    return $(".post-list .col-md-3").toArray().map<IMovie>(item => {
      const a = $(item).find("a")
      const img = a.find("img")
      const id = a.attr("href") ?? ""
      let cover = img.attr("data-original") ?? ""
      cover = `${env.baseUrl}${cover}`
      const title = img.attr("alt") ?? ""
      return { id, cover, title }
    })
  }
  async getDetail() {
    const id = env.get<string>("movieId")
    const url = `${env.baseUrl}${id}`
    const html = await req(url)
    const $ = kitty.load(html)
    const m3u8 = kitty.utils.getM3u8WithStr(html)
    const title = $(".breadcrumb").text().trim()
    return <IMovie>{
      id,
      title,
      playlist: [
        {
          title: "默认", videos: [
            { text: "😍播放", url: m3u8 }
          ]
        }
      ]
    }
  }
}

// TEST
// const env = createTestEnv("https://yjb.one")
// const call = new Yjbav();
// (async ()=> {
//   const cates = await call.getCategory()
//   env.set("category", cates[0].id)
//   env.set("page", 1)
//   const home = await call.getHome()
//   env.set("movieId", home[0].id)
//   const detail = await call.getDetail()
//   debugger
// })()