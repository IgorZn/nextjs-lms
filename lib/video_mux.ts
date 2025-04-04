import Mux from '@mux/mux-node'

const client = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'], // This is the default and can be omitted
  tokenSecret: process.env['MUX_TOKEN_SECRET'], // This is the default and can be omitted
})

export function muxMain() {
  return {
    deleteAsset: async id => {
      console.log('[Mux][deleteAsset] id', id)
      return client.video.assets.delete(id)
    },
    createAsset: async (url, policy = 'public') => {
      console.log('[Mux][createAsset] url', url)
      return client.video.assets.create({ input: [{ url: url }], playback_policy: policy })
    },
  }
}
