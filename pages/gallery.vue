<template>
  <div class="text-white min-h-screen bg-gray-100">
    <div
      class="bg-gradient-to-r from-green-500 to-blue-400 md:pt-10 border-b-2 border-gray-700"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 md:flex lg:px-8">
        <div
          class="relative mx-auto my-auto flex flex-col items-center text-center"
        >
          <h2
            class="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl flex"
          >
            Browse Around Drawings
          </h2>
          <div
            class="sm mt-8 flex flex-col sm:flex-row sm:space-x-4 sm:px-0 lg:mt-12"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <article
        v-for="dessin in drawings"
        :key="dessin.id"
        class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300"
      >
        <a href="#">
          <div class="relative flex items-end overflow-hidden rounded-xl">
            <img :src="dessin.link" alt="Drawing" class="border rounded-xl" />
          </div>

          <div class="mt-1 p-1">
            <div class="flex items-end justify-between" v-if="user.online">
              <div class="font-semibold text-gray-500">{{ dessin.created_at }}</div>
              <div
                class="text-lg font-semibold text-gray-500 flex items-end justify-end gap-2"
                @click="like(dessin.id_dessin)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                  :class="{
                    'text-gray-500': dessin.num_likes === '0',
                    'text-blue-500': dessin.num_likes != '0',
                  }"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  />
                </svg>
                {{ dessin.num_likes }}
              </div>
            </div>

            <div class="flex items-end justify-between" v-else>
              <div class="font-semibold text-gray-500">{{ dessin.created_at }}</div>
              <div
                class="text-lg font-semibold text-gray-500 flex items-end justify-end gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4 text-gray-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  />
                </svg>
                {{ dessin.likes }}
              </div>
            </div>
          </div>
        </a>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      drawings: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
    }),
  },
  mounted() {
    this.fetchDrawing();
  },
  methods: {
    fetchDrawing() {
      try {
        this.$axios
          .get("http://localhost/my-app/ScribblBack/display_drawings.php")
          .then((response) => {
            this.drawings = response.data;
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    },
    like(id) {
      if (!id) {
      console.error('Error liking drawing: Invalid id');
      return;
  }
      // Send a request to like the tweet using the tweetId and user token
      this.$axios
        .post(
          "http://localhost/my-app/ScribblBack/like_dessin.php?id=" +
            id +
            "&token=" +
            this.user.token
        )
        .then((response) => {
          console.log(response.data);
          this.fetchDrawing();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
