import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class ygg01 implements Handle {
  getConfig(): IConfig {
    return {
      id: 'ygg01',
      name: '阳光影院',
      api: 'https://www.ygg01.com',
      nsfw: false,
      type: 1,
      extra: { gfw: false, searchLimit: 12 }
    }
  }

  async getCategory(): Promise<ICategory[]> {
    return [
      { text: '首页', id: '/' },
      { text: '电影', id: '1' },
      { text: '电视剧', id: '2' },
      { text: '综艺', id: '3' },
      { text: '动漫', id: '4' }
    ]
  }

  async getHome(env: any): Promise<any> {
    const cate = env.get('category')
    const page = env.get('page') || 1
    const url = cate === '/' ? env.baseUrl : `${env.baseUrl}/vod/type/id/${cate}/page/${page}.html`
    const $ = kitty.load(await req(url))
    return $('.hl-vod-list li').map((i, el) => {
      const a = $(el).find('a')
      return {
        id: a.attr('href') || '',
        title: a.attr('title') || '',
        cover: a.attr('data-original') || '',
        remark: $(el).find('.remarks').text().trim()
      }
    }).toArray()
  }

  async getDetail(env: any): Promise<IMovie> {
    const url = `${env.baseUrl}${env.get('movieId')}`
    const $ = kitty.load(await req(url))
    const desc = $('.blurb').text().trim()
    const tabs = $('.hl-plays-from a').map((i, e) => $(e).text().trim()).toArray()
    const videos = $('.hl-tabs-box').map((i, box) =>
      $(box).find('li a').map((j, a) => ({ id: $(a).attr('href') || '', text: $(a).text().trim() })).toArray()
    ).toArray()
    return { desc, playlist: tabs.map((t, i) => ({ title: t, videos: videos[i] })) }
  }

  async getSearch(env: any): Promise<IMovie[]> {
    const wd = env.get('keyword')
    const page = env.get('page') || 1
    const url = `${env.baseUrl}/vod/search/page/${page}/wd/${wd}.html`
    const $ = kitty.load(await req(url))
    return $('.hl-one-list li').map((i, el) => ({
      id: $(el).find('a').attr('href') || '',
      title: $(el).find('a').attr('title') || '',
      cover: $(el).find('a').attr('data-original') || '',
      remark: ''
    })).toArray()
  }

  async parseIframe(env: any): Promise<string> {
    const html = await req(`${env.baseUrl}${env.get('iframe')}`)
    const m = html.match(/player_aaaa=({.*?})/)
    if (!m) throw ''
    return JSON.parse(m[1]).url
  }
}
