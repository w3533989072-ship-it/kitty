import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class ysgc implements Handle {
  getConfig(): IConfig {
    return { id: 'ysgc', name: '影视工场', api: 'https://www.ysgc.tv', nsfw: false, type: 1, extra: { gfw: false, searchLimit: 12 } }
  }

  async getCategory(): Promise<ICategory[]> {
    return [{ text: '首页', id: '/' }, { text: '电影', id: '1' }, { text: '电视剧', id: '2' }, { text: '综艺', id: '3' }, { text: '动漫', id: '4' }]
  }

  async getHome(env: any): Promise<any> {
    const cate = env.get('category') || '/'
    const page = env.get('page') || 1
    const url = `${env.baseUrl}/vod/type/${cate === '/' ? 'index' : cate}-${page}.html`
    const $ = kitty.load(await req(url))
    return $('.vod-list li').map((i, el) => {
      const a = $(el).find('a')
      return { id: a.attr('href') || '', title: a.attr('title') || '', cover: a.attr('data-original') || '', remark: '' }
    }).toArray()
  }

  async getDetail(env: any): Promise<IMovie> {
    const url = `${env.baseUrl}${env.get('movieId')}`
    const $ = kitty.load(await req(url))
    const desc = $('.intro').text().trim()
    const tabs = $('.play-tab a').map((i, e) => $(e).text().trim()).toArray()
    const videos = $('.play-content').map((i, box) => $(box).find('li a').map((j, a) => ({ id: $(a).attr('href') || '', text: $(a).text().trim() })).toArray()).toArray()
    return { desc, playlist: tabs.map((t, i) => ({ title: t, videos: videos[i] })) }
  }

  async getSearch(env: any): Promise<IMovie[]> {
    const wd = env.get('keyword')
    const url = `${env.baseUrl}/search/?wd=${wd}`
    const $ = kitty.load(await req(url))
    return $('.search-list li').map((i, el) => ({ id: $(el).find('a').attr('href') || '', title: $(el).find('a').attr('title') || '', cover: $(el).find('a').attr('data-original') || '', remark: '' })).toArray()
  }

  async parseIframe(env: any): Promise<string> {
    const html = await req(`${env.baseUrl}${env.get('iframe')}`)
    const m = html.match(/src\s*=\s*["']([^"']+)/)
    return m?.[1] || ''
  }
}

