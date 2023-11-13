// @ts-ignore
import Kuroshiro from "kuroshiro"
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji/dist/kuroshiro-analyzer-kuromoji"

let kuroshiro: Kuroshiro

type ExtendedXMLHttpRequest = XMLHttpRequest & {
  patched_open: (method: string, url: string) => void
}

const dictPath = "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict"
const dictPathWithoutDoubleSlash =
  "https:/cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict"
/**
 * Fix an issue with kuromoji when loading dict from external urls
 * See: https://github.com/takuyaa/kuromoji.js/issues/37
 * Adapted from: https://github.com/mobilusoss/textlint-browser-runner/pull/7
 */
function applyKuromojiFix(): void {
  ;(XMLHttpRequest.prototype as ExtendedXMLHttpRequest).patched_open =
    XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method: string, url: string) {
    if (url.indexOf(dictPathWithoutDoubleSlash) === 0) {
      ;(this as ExtendedXMLHttpRequest).patched_open(
        method,
        url.replace(dictPathWithoutDoubleSlash, dictPath)
      )
    } else {
      ;(this as ExtendedXMLHttpRequest).patched_open(method, url)
    }
  }
}

async function createKuroshiro(): Promise<Kuroshiro> {
  applyKuromojiFix()

  kuroshiro = new Kuroshiro()
  const analyzer: KuromojiAnalyzer = new KuromojiAnalyzer({
    dictPath: dictPath
  })

  await kuroshiro.init(analyzer)
  kuroshiro.Util = Kuroshiro.Util
  console.log("Kuroshiro initialized", kuroshiro)
  return kuroshiro
}

function getKuroshiro(): Promise<Kuroshiro> {
  if (kuroshiro) {
    return Promise.resolve(kuroshiro)
  }
  return createKuroshiro()
}
getKuroshiro()

export const hasJapanese = (str: string) => {
  return kuroshiro.Util.hasJapanese(str)
}

export const exportRomaji = async (str: string) => {
  const res = await kuroshiro.convert(str, {
    to: "romaji",
    mode: "spaced"
  })
  return `${res.charAt(0).toUpperCase()}${res.slice(1)}`
}
