<template>

  <div class="">
    <div
      class="bg-gradient-to-r from-green-500 to-blue-400 md:pt-10 border-b-2 border-gray-700 text-white"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 md:flex lg:px-8">
        <div
          class="relative mx-auto my-auto flex flex-col items-center text-center"
        >
          <h2
            class="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl flex"
          >
            Event
          </h2>
          <div
            class="sm mt-8 flex flex-col sm:flex-row sm:space-x-4 sm:px-0 lg:mt-12"
          ></div>
        </div>
      </div>
    </div>
    <div class="max-w-3xl mx-auto mt-20">
        <div>
        <div class="relative z-0 mb-6 w-full group">
            <input
            type="text"
            name="event_name"
            id="event_name"
            v-model="event_name"

            class="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            />
            <label
            for="event_name"
            class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Event Name</label
            >
        </div>
        <div class="relative z-0 mb-6 w-full group">
            <input
            type="date"
            name="start_date"
            id="start_date"
            v-model="start_date"
            class="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
            />
            <label
            for="start_date"
            class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Start date</label
            >
        </div>
        <div class="grid xl:grid-cols-2 xl:gap-6">
            <div class="relative z-0 mb-6 w-full group">
            <input
                type="time"
                name="start_hour"
                id="start_hour"
                v-model="start_hour"

                class="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=""
                required
            />
            <label
                for="start_hour"
                class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Start Hour</label
            >
            </div>
            <div class="relative z-0 mb-6 w-full group">
            <input
                type="time"
                name="end_hour"
                id="end_hour"
                v-model="end_hour"

                class="block py-2.5 px-0 w-full text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
            />
            <label
                for="end_hour"
                class="absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >End Hour</label
            >
            </div>
        </div>
        <button
            @click="start()"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Create Event
        </button>
        </div>
    </div>
  </div>  
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      event_name: "",
      start_date: "",
      start_hour: "",
      end_hour: "",
      errorMessage: "",
    };
  },
  methods: {
    start() {
        console.log(this.event_name)
      const formData = new FormData();
      formData.append("event_name", this.event_name);
      formData.append("start_date", this.start_date);
      formData.append("start_hour", this.start_hour);
      formData.append("end_hour", this.end_hour);

      // Vérifier que les champs sont remplis
      if (!this.event_name || !this.start_date || !this.start_hour || !this.end_hour) {
        this.errorMessage = "Veuillez remplir tous les champs";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3500); // masquer le message après 3,5 secondes
        return;
      }

      axios
        .post("http://localhost/my-app/ScribblBack/add_event.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data === "Un évenement avec ce nom existe déjà.") {
            this.errorMail = response.data;
            setTimeout(() => {
              this.errorMail = "";
            }, 3500);
            return;
          }
        //  this.$store.commit('user/addEvent', { name: this.event_name, name: this.event_name, name: this.event_name, name: this.event_name, token: response.data.token })
          this.successMessage = "Evenement enregistré avec succès!";

          console.log(response.data);
          setTimeout(() => {
            this.successMessage = "";
          }, 5000);
          // masquer le message après 5 secondes
          this.event_name = "";
          this.start_date = "";
          this.start_hour = "";
          this.end_hour = "";
        })

        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
