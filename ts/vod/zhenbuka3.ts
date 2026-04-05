import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class zhenbuka3 implements Handle {
  getConfig(): IConfig {
    return {
      id: 'zhenbuka3',
      name: '真不卡',
      api: 'https://www.zhenbuka3.com',
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
      { text: '动漫', id: '4' },
      { text: '短剧', id: '5' }
    ]
  }

  async getHome(env: any): Promise<any> {
    const cate = env.get('category')
    const page = env.get('page') || 1
    const url = cate === '/' ? env.baseUrl : `${env.baseUrl}/vod/type/${cate}-${page}.html`
    const $ = kitty.load(await req(url))
    return $('.vod-item').map((i, el) => {
      const a = $(el).find('a')
      return {
        id: a.attr('href') || '',
        title: a.attr('title') || '',
        cover: a.find('img').attr('data-src') || '',
        remark: $(el).find('.score').text().trim()
      }
    }).toArray()
  }

  async getDetail(env: any): Promise<IMovie> {
    const url = `${env.baseUrl}${env.get('movieId')}`
    const $ = kitty.load(await req(url))
    const desc = $('.desc').text().trim()
    const tabs = $('.server-tab a').map((i, e) => $(e).text().trim()).toArray()
    const videos = $('.server-list').map((i, box) =>
      $(box).find('li a').map((j, a) => ({ id: $(a).attr('href') || '', text: $(a).text().trim() })).toArray()
    ).toArray()
    return { desc, playlist: tabs.map((t, i) => ({ title: t, videos: videos[i] })) }
  }

  async getSearch(env: any): Promise<IMovie[]> {
    const wd = env.get('keyword')
    const page = env.get('page') || 1
    const url = `${env.baseUrl}/search?q=${wd}&page=${page}`
    const $ = kitty.load(await req(url))
    return $('.search-result .vod-item').map((i, el) => ({
      id: $(el).find('a').attr('href') || '',
      title: $(el).find('a').attr('title') || '',
      cover: $(el).find('img').attr('data-src') || '',
      remark: ''
    })).toArray()
  }

  async parseIframe(env: any): Promise<string> {
    const url = `${env.baseUrl}${env.get('iframe')}`
    const html = await req(url)
    const m = html.match(/playUrl\s*=\s*["']([^"']+)/)
    return m?.[1] || ''
  }
}
