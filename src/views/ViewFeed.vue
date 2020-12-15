<template>
  <div>
    <Feed :feed-id="Number($route.params.feedId)" />
  </div>
</template>
<script>
import Feed from '../components/Feed'
export default {
  name: "Feeds",
  components: {
    Feed
  },
}
</script>