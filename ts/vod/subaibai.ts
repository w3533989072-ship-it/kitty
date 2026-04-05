import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class subaibai implements Handle {
  getConfig(): IConfig {
    return {
      id: 'subaibai',
      name: '素白白',
      api: 'https://www.subaibai.com',
      nsfw: false,
      type: 1,
      extra: { gfw: false, searchLimit: 12 }
    }
  }

  async getCategory(): Promise<ICategory[]> {
    return [
      { text: '首页', id: '/' },
      { text: '电影', id: '1' },
      { text: '剧集', id: '2' },
      { text: '综艺', id: '3' },
      { text: '动漫', id: '4' }
    ]
  }

  async getHome(env: any): Promise<any> {
    const page = env.get('page') || 1
    const url = `${env.baseUrl}/page/${page}`
    const $ = kitty.load(await req(url))
    return $('.video-item').map((i, el) => ({
      id: $(el).find('a').attr('href') || '',
      title: $(el).find('.title').text().trim(),
      cover: $(el).find('img').attr('data-src') || '',
      remark: $(el).find('.note').text().trim()
    })).toArray()
  }

  async getDetail(env: any): Promise<IMovie> {
    const url = `${env.baseUrl}${env.get('movieId')}`
    const $ = kitty.load(await req(url))
    const desc = $('.detail-desc').text().trim()
    const playlist = $('.play-list').map((i, box) => ({
      title: `线路${i+1}`,
      videos: $(box).find('a').map((j, a) => ({ id: $(a).attr('href') || '', text: $(a).text().trim() })).toArray()
    })).toArray()
    return { desc, playlist }
  }

  async getSearch(env: any): Promise<IMovie[]> {
    const wd = env.get('keyword')
    const url = `${env.baseUrl}/search/${wd}`
    const $ = kitty.load(await req(url))
    return $('.search-item').map((i, el) => ({
      id: $(el).find('a').attr('href') || '',
      title: $(el).find('.title').text().trim(),
      cover: $(el).find('img').attr('data-src') || '',
      remark: ''
    })).toArray()
  }

  async parseIframe(env: any): Promise<string> {
    const url = `${env.baseUrl}${env.get('iframe')}`
    const html = await req(url)
    const m = html.match(/url["']?\s*[:=]\s*["']([^"']+)/)
    return m?.[1] || ''
  }
}
