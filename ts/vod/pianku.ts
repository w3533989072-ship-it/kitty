import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IHomeData, IMovie, IPlaylist } from 'types'

export default class pianku implements Handle {
  getConfig(): IConfig {
    return {
      id: 'pianku',
      name: '片库',
      api: 'https://www.pdy8.com',
      nsfw: false,
      type: 1,
      extra: { gfw: false, searchLimit: 12 }
    }
  }

  async getCategory(): Promise<ICategory[]> {
    return [
      { text: "首页", id: "/" },
      { text: "电影", id: "1" },
      { text: "电视剧", id: "2" },
      { text: "综艺", id: "3" },
      { text: "动漫", id: "4" },
      { text: "短剧", id: "57" }
    ]
  }

  async getHome(env: any): Promise<any> {
    const cate = env.get('category')
    const page = env.get('page') || 1
    const url = cate === '/' ? env.baseUrl : `${env.baseUrl}/index.php/vod/type/id/${cate}/page/${page}.html`
    const $ = kitty.load(await req(url))
    return $(".hl-vod-list li").toArray().map(item => {
      const a = $(item).find("a")
      return {
        id: a.attr("href") ?? "",
        cover: a.attr("data-original") ?? "",
        title: a.attr("title") ?? "",
        remark: $(item).find(".remarks").text().trim()
      }
    })
  }

  async getDetail(env: any): Promise<IMovie> {
    const url = `${env.baseUrl}${env.get("movieId")}`
    const $ = kitty.load(await req(url))
    let desc = $(".blurb").text().trim().replace("简介：", "")
    desc = desc === "暂无简介" ? "" : desc
    const tabs = $(".hl-plays-from a").toArray().map(e => $(e).text().trim())
    const videos = $(".hl-tabs-box").toArray().map(box =>
      $(box).find("li a").toArray().map(a => ({ id: $(a).attr("href") ?? "", text: $(a).text().trim() }))
    )
    return { desc, playlist: tabs.map((title, i) => ({ title, videos: videos[i] })) }
  }

  async getSearch(env: any): Promise<IMovie[]> {
    const wd = env.get("keyword")
    const page = env.get("page") || 1
    const url = `${env.baseUrl}/index.php/vod/search/page/${page}/wd/${wd}.html`
    const $ = kitty.load(await req(url))
    return $(".hl-one-list li").toArray().map(item => ({
      id: $(item).find("a").attr("href") ?? "",
      cover: $(item).find("a").attr("data-original") ?? "",
      title: $(item).find("a").attr("title") ?? "",
      remark: ""
    }))
  }

  async parseIframe(env: any): Promise<string> {
    const html = await req(`${env.baseUrl}${env.get("iframe")}`)
    const code = html.match(/player_aaaa=(.+?);/)?.[1]
    if (!code) throw "解析失败"
    const obj = eval(`(${code})`)
    if (obj.encrypt === "1") return unescape(obj.url)
    if (obj.encrypt === "2") return unescape(atob(obj.url))
    return obj.url
  }
}
