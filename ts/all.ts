import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class baisi implements Handle {
  getConfig(): IConfig {
    return {
      id: 'baisi',
      name: '百思影视',
      api: 'https://www.baisi.tv',
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
    const url = cate === '/' ? env.baseUrl : `${env.baseUrl}/vod/type/${cate}/page/${page}.html`
    const $ = kitty.load(await req(url))
    return $('.vod-item').map((i, el) => {
      const a = $(el).find('a')
      return {
        id: a.attr('href') || '',
        title: a.attr('title') || '',
        cover: a.find('img').attr('data-src') || '',
        remark: $(el).find('.note').text().trim()
      }
    }).toArray()
  }
  async getDetail(env: any): Promise<IMovie> {
    const url = `${env.baseUrl}${env.get('movieId')}`
    const $ = kitty.load(await req(url))
    const desc = $('.desc').text().trim()
    const tabs = $('.play-tab a').map((i, e) => $(e).text().trim()).toArray()
    const videos = $('.play-list').map((i, box) =>
      $(box).find('li a').map((j, a) => ({ id: $(a).attr('href') || '', text: $(a).text().trim() })).toArray()
    ).toArray()
    return { desc, playlist: tabs.map((t, i) => ({ title: t, videos: videos[i] })) }
  }
  async getSearch(env: any): Promise<IMovie[]> {
    const wd = env.get('keyword')
    const url = `${env.baseUrl}/search?wd=${wd}`
    const $ = kitty.load(await req(url))
    return $('.search-item').map((i, el) => ({
      id: $(el).find('a').attr('href') || '',
      title: $(el).find('a').attr('title') || '',
      cover: $(el).find('img').attr('data-src') || '',
      remark: ''
    })).toArray()
  }
  async parseIframe(env: any): Promise<string> {
    const html = await req(`${env.baseUrl}${env.get('iframe')}`)
    const m = html.match(/src\s*=\s*["']([^"']+)/)
    return m?.[1] || ''
  }
}

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class bestpipe implements Handle {
  getConfig(): IConfig {
    return {
      id: 'bestpipe',
      name: 'BestPipe',
      api: 'https://www.bestpipe.com',
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
    const url = `${env.baseUrl}/search?q=${wd}`
    const $ = kitty.load(await req(url))
    return $('.search-item').map((i, el) => ({
      id: $(el).find('a').attr('href') || '',
      title: $(el).find('.title').text().trim(),
      cover: $(el).find('img').attr('data-src') || '',
      remark: ''
    })).toArray()
  }
  async parseIframe(env: any): Promise<string> {
    const html = await req(`${env.baseUrl}${env.get('iframe')}`)
    const m = html.match(/url["']?\s*[:=]\s*["']([^"']+)/)
    return m?.[1] || ''
  }
}

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class chengzi implements Handle {
  getConfig(): IConfig {
    return {
      id: 'chengzi',
      name: '橙子影视',
      api: 'https://www.chengzi.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class duonaovod implements Handle {
  getConfig(): IConfig {
    return {
      id: 'duonaovod',
      name: '多瑙影院',
      api: 'https://www.duonaovod.com',
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
      { text: '短剧', id: '57' }
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
    const desc = $('.blurb').text().replace('简介：', '').trim()
    const tabs = $('.hl-plays-from a').map((i, e) => $(e).text().trim()).toArray()
    const videos = $('.hl-tabs-box').map((i, e) =>
      $(e).find('li a').map((j, a) => ({ id: $(a).attr('href') || '', text: $(a).text().trim() })).toArray()
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
    const url = `${env.baseUrl}${env.get('iframe')}`
    const html = await req(url)
    const m = html.match(/player_aaaa=({.*?})/)
    if (!m) throw '未获取到播放地址'
    const obj = JSON.parse(m[1])
    return obj.url
  }
}

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class freeok implements Handle {
  getConfig(): IConfig {
    return {
      id: 'freeok',
      name: 'FreeOK',
      api: 'https://www.freeok.vip',
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
    const obj = JSON.parse(m[1])
    return obj.url
  }
}

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class hongdou implements Handle {
  getConfig(): IConfig {
    return {
      id: 'hongdou',
      name: '红豆影视',
      api: 'https://www.hongdou.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class lizhi implements Handle {
  getConfig(): IConfig {
    return {
      id: 'lizhi',
      name: '荔枝影视',
      api: 'https://www.lizhi.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class lvc implements Handle {
  getConfig(): IConfig {
    return {
      id: 'lvc',
      name: '绿茶影视',
      api: 'https://www.lvc.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class mahua implements Handle {
  getConfig(): IConfig {
    return {
      id: 'mahua',
      name: '麻花影视',
      api: 'https://www.mahua.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class mangguo implements Handle {
  getConfig(): IConfig {
    return {
      id: 'mangguo',
      name: '芒果影视',
      api: 'https://www.mangguo.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class mitao implements Handle {
  getConfig(): IConfig {
    return {
      id: 'mitao',
      name: '蜜桃影视',
      api: 'https://www.mitao.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class nangua implements Handle {
  getConfig(): IConfig {
    return {
      id: 'nangua',
      name: '南瓜影视',
      api: 'https://www.nangua.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

export default class ningmeng implements Handle {
  getConfig(): IConfig {
    return {
      id: 'ningmeng',
      name: '柠檬影视',
      api: 'https://www.ningmeng.tv',
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

import { kitty, req } from 'utils'
import type { Handle, IConfig, ICategory, IMovie, IPlaylist } from 'types'

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
