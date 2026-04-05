import { writeFileSync } from 'fs'
import { join } from 'path'
import { getAvailableCategoryWithCfg } from "./vod_utils"
import { req } from "utils"

const vods = <Iconfig[]>[
  {
    id: "niuniuziyuan",
    name: "牛牛视频",
    api: "https://api.niuniuzy.me/api.php/provide/vod",
    nsfw: false,
    logo: "https://api.niuniuzy.me/template/niuniuzy/static/images/logo.png",
    type: 0,
    extra: {
      gfw: false,
    },
  },
  {
    id: "feifanziyuan",
    name: "非凡资源",
    api: "http://cj.ffzyapi.com/api.php/provide/vod/at/xml",
    logo: "http://cj.ffzyapi.com/template/ffzy/static/picture/logo.png",
    nsfw: false,
    type: 0,
    extra: {
      gfw: false,
    },
  },
];

const nsfwVods: Iconfig[] = [
  {
    id: "Xxibaoziyuan",
    name: "X细胞资源",
    api: "https://www.xxibaozyw.com/api.php/provide/vod",
    nsfw: true,
    type: 0,
    extra: {
      gfw: false,
    },
  },
  {
    id: "91shipin",
    name: "91视频",
    api: "https://91av.cyou/api.php/provide/vod/",
    nsfw: true,
    type: 0,
    extra: {
      gfw: true,
    },
  },
] 

// from args context
const args = process.argv.slice(2)
const vodFile = args[0]
const nsfwodFile = args[1]
const file1 = join(process.cwd(), vodFile)
const file2 = join(process.cwd(), nsfwVodFile);

(async () => {
  writeFileSync(file1, JSON.stringify(vods, null, 2))
  writeFileSync(file2, JSON.stringify(nsfwVods, null, 2))
})()
