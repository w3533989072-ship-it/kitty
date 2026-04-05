// import { kitty, req, createTestEnv } from 'utils'

interface IGetInfoBody {
  RecordsPage: 20
  command: "WEB_GET_INFO"
  content: string
  languageType: "CN"
  pageNumber: number
  typeId: number | string
  typeMid: 1
  type?: 1
}

interface ICard {
  id: string
  type_Mid: 1
  typeName: string
  vod_class: string
  vod_name: string
  vod_pic: string
  vod_server_id: number
  vod_url: string
}

interface IGetDetailBody {
  command: "WEB_GET_INFO_DETAIL"
  id: string
  languageType: "CN"
  type_Mid: "1"
}

interface IInfoResponse {
  data: {
    count: string
    pageAllNumber: string
    pageNumber: string
    resultList: Array<ICard>
  }
}

interface IDetailResponse {
  data: {
    result: ICard
  }
}

export default class VV99KK implements Handle {
  getConfig() {
    return <Iconfig>{
      id: 'vv99kk',
      name: '熊猫视频',
      api: 'https://spiderscloudcn2.51111666.com',
      type: 1,
      nsfw: true,
      extra: {
        gfw: false,
      }
    }
  }
  async getCategory() {
    const table = [
      {
        "id": "6",
        "text": "OTElRTQlQkMlQTAlRTUlQUElOTI="
      },
      {
        "id": "7",
        "text": "JUU3JUIyJUJFJUU0JUI4JTlDJUU0JUJDJUEwJUU1JUFBJTky"
      },
      {
        "id": "8",
        "text": "JUU5JUJBJUJCJUU4JUIxJTg2JUU0JUJDJUEwJUU1JUFBJTky"
      },
      {
        "id": "9",
        "text": "JUU5JUJBJUJCJUU4JUIxJTg2JUU2JTk4JUEwJUU3JTk0JUJC"
      },
      {
        "id": "10",
        "text": "JUU5JUJBJUJCJUU4JUIxJTg2JUU3JThDJUFCJUU3JTg4JUFB"
      },
      {
        "id": "11",
        "text": "JUU4JTlDJTlDJUU2JUExJTgzJUU0JUJDJUEwJUU1JUFBJTky"
      },
      {
        "id": "12",
        "text": "JUU1JUE0JUE5JUU3JUJFJThFJUU0JUJDJUEwJUU1JUFBJTky"
      },
      {
        "id": "13",
        "text": "JUU2JTk4JTlGJUU3JUE5JUJBJUU0JUJDJUEwJUU1JUFBJTky"
      },
      {
        "id": "14",
        "text": "JUU1JTgxJUI3JUU2JThCJThEJUU4JTg3JUFBJUU2JThCJThE"
      },
      {
        "id": "15",
        "text": "JUU2JTk3JUE1JUU5JTlGJUE5JUU4JUE3JTg2JUU5JUEyJTkx"
      },
      {
        "id": "16",
        "text": "JUU2JUFDJUE3JUU3JUJFJThFJUU2JTgwJUE3JUU3JTg4JUIx"
      },
      {
        "id": "17",
        "text": "JUU2JTk5JUJBJUU4JTgzJUJEJUU2JThEJUEyJUU4JTg0JUI4"
      },
      {
        "id": "18",
        "text": "JUU3JUJCJThGJUU1JTg1JUI4JUU0JUI4JTg5JUU3JUJBJUE3"
      },
      {
        "id": "19",
        "text": "JUU3JUJEJTkxJUU3JUJBJUEyJUU0JUI4JUJCJUU2JTkyJUFE"
      },
      {
        "id": "20",
        "text": "JUU1JThGJUIwJUU2JUI5JUJFJUU4JUJFJUEzJUU1JUE2JUI5"
      },
      {
        "id": "21",
        "text": "b25seWZhbnM="
      },
      {
        "id": "22",
        "text": "JUU0JUI4JUFEJUU2JTk2JTg3JUU1JUFEJTk3JUU1JUI5JTk1"
      },
      {
        "id": "23",
        "text": "JUU3JUJCJThGJUU1JTg1JUI4JUU3JUI0JUEwJUU0JUJBJUJB"
      },
      {
        "id": "24",
        "text": "JUU5JUFCJTk4JUU2JUI4JTg1JUU2JTk3JUEwJUU3JUEwJTgx"
      },
      {
        "id": "25",
        "text": "JUU3JUJFJThFJUU5JUEyJTlDJUU1JUI3JUE4JUU0JUI5JUIz"
      },
      {
        "id": "26",
        "text": "JUU0JUI4JTlEJUU4JUEyJTlDJUU1JTg4JUI2JUU2JTlDJThE"
      },
      {
        "id": "27",
        "text": "U00lRTclQjMlQkIlRTUlODglOTc="
      },
      {
        "id": "28",
        "text": "JUU2JUFDJUE3JUU3JUJFJThFJUU3JUIzJUJCJUU1JTg4JTk3"
      },
      {
        "id": "29",
        "text": "SCVFNSU4QiU5NSVFNyU5NSVBQg=="
      }
    ]
    return table.map(item => {
      const { id, text } = item
      const a = atob(text)
      const b =  decodeURIComponent(a)
      return { id, text: b }
    })
  }
  async getHome() {
    const cate = env.get<string>("category")
    const page = env.get("page")
    const unsafeObj: IInfoResponse = JSON.parse(await req(`${env.baseUrl}/forward`, {
      method: "POST",
      noCache: true,
      data: <IGetInfoBody>{
        RecordsPage: 20,
        command: "WEB_GET_INFO",
        content: "",
        languageType: "CN",
        pageNumber: page,
        typeId: cate,
        typeMid: 1,
      }
    }))
    return unsafeObj.data.resultList.map<IMovie>(item => {
      return {
        id: item.id,
        cover: item.vod_pic,
        title: item.vod_name,
        remark: item.vod_class,
      }
    })
  }
  async getDetail() {
    const id = env.get<string>("movieId")
    const response: IDetailResponse = JSON.parse(await req(`${env.baseUrl}/forward`, {
      method: "POST",
      noCache: true,
      data: <IGetDetailBody>{
        command: "WEB_GET_INFO_DETAIL",
        id,
        languageType: "CN",
        type_Mid: "1",
      }
    }))
    const _ = response.data.result

    const initObj: {
      data: {
        macVodLinkMap: Record<string, Record<string, string>>
      }
    } = JSON.parse(await req(`${env.baseUrl}/getDataInit`, {
      method: "POST",
      data: {
        age: 31,
        city: "New York",
        name: "John"
      }
    }))

    const xl1 = initObj.data.macVodLinkMap

    let playUrl = ""
    let xl: any = false
    const num = Math.floor(Math.random() * 2 + 1);
    // var playImgUrl = "";
    if (null != xl) {
      // playImgUrl = xl1[response.data.result.vod_server_id].PIC_LINK_1 + response.data.result.vod_pic;
      if (xl == 1) {
        playUrl = xl1[response.data.result.vod_server_id].LINK_1 + response.data.result.vod_url;
      } else if (xl == 2) {
        playUrl = xl1[response.data.result.vod_server_id].LINK_2 + response.data.result.vod_url;
      } else if (xl == 3) {
        playUrl = xl1[response.data.result.vod_server_id].LINK_3 + response.data.result.vod_url;
      } else {
        if (num == 1) {
          playUrl = xl1[response.data.result.vod_server_id].LINK_1 + response.data.result.vod_url;
          console.log(1);
        } else if (num == 2) {
          playUrl = xl1[response.data.result.vod_server_id].LINK_2 + response.data.result.vod_url;
          console.log(2);
        } else {
          playUrl = xl1[response.data.result.vod_server_id].LINK_1 + response.data.result.vod_url;
          console.log(3);
        }
      }
    }

    return <IMovie>{
      id,
      title: _.vod_name,
      playlist: [
        {
          title: "默认",
          videos: [
            {
              url: playUrl,
              text: "播放",
            }
          ]
        }
      ]
    };
  }
  async getSearch() {
    const wd = env.get<string>("keyword")
    const page = env.get("page")
    const unsafeObj: IInfoResponse = JSON.parse(await req(`${env.baseUrl}/forward`, {
      method: "POST",
      noCache: true,
      data: <IGetInfoBody>{
        RecordsPage: 20,
        command: "WEB_GET_INFO",
        content: wd,
        languageType: "CN",
        pageNumber: page,
        type: 1,
        typeMid: 1,
        typeId: 0,
      }
    }))
    return unsafeObj.data.resultList.map<IMovie>(item => {
      return {
        id: item.id,
        cover: item.vod_pic,
        title: item.vod_name,
        remark: item.vod_class,
      }
    })
  }
}

// TEST
// const env = createTestEnv(`https://spiderscloudcn2.51111666.com`)
// const call = new VV99KK();
// (async () => {
//   const cates = await call.getCategory()
//   env.set("category", cates[0].id)
//   env.set("page", 1)
//   const home = await call.getHome()
//   env.set("movieId", home[0].id)
//   const detail = await call.getDetail()
//   env.set("keyword", "黑丝")
//   const search = await call.getSearch()
//   debugger
// })()