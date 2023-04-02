<template>
  <div class="text-white min-h-screen bg-gray-100">
    <div
      class="bg-gradient-to-r from-green-500 to-blue-400 py-10 sm:py-10 md:pt-20 border-b-2 border-gray-700"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 md:flex lg:px-8">
        <div class="relative mx-auto my-auto flex flex-col items-center text-center">
          <h2 class="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl flex">
            Browse Around Drawings
          </h2>
          <div
            class="sm mt-8 flex flex-col sm:flex-row sm:space-x-4 sm:px-0 lg:mt-12"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="mx-auto flex w-full text-gray-800 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-8"
    >
      <div
        v-for="dessin in drawings"
        :key="dessin.id_dessin"
        class="w-full border border-gray-400 rounded-lg"
      >
        <div
          target="_blank"
          class="mx-auto mt-11 w-80 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg"
        >
          <img
            class="h-48 w-full object-cover object-center rounded-t-lg"
            :src="dessin.link"
            alt="Drawing Image"
          />
          <div class="px-2 py-1">
            <div class="flex items-center">
              <h2 class="text-md font-medium dark:text-white text-gray-600">
                27/03/2023
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      drawings: [],
    };
  },
  mounted() {
    axios
      .get("http://localhost/my-app/ScribblBack/display_drawings.php")
      .then((response) => {
        this.drawings = response.data.dessins;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
