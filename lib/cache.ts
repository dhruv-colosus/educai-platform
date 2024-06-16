import { LRUCache } from "lru-cache"

const cache = new LRUCache<string, any>({
  max: 4096,
})

export default cache
