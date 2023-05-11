<template>
  <div class="text-white min-h-screen bg-gray-100">
    <div
      class="bg-gradient-to-r from-green-500 to-blue-400 md:pt-10 border-b-2 border-gray-700"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 md:flex lg:px-8">
        <div class="relative mx-auto my-auto flex flex-col items-center text-center">
          <h2 class="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl flex">
            Draw
          </h2>
          <div
            class="sm mt-8 flex flex-col sm:flex-row sm:space-x-4 sm:px-0 lg:mt-12"
          ></div>
        </div>
      </div>
    </div>
    <div class="show-area mx-auto">
      <PaintCanvasDraw :width="1000" :height="780" :outputName="'example'"/>
    </div>
  </div>
</template>

