import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {ripple: true});
    nuxtApp.vueApp.component("Menubar", Menubar);
    nuxtApp.vueApp.component("InputText", InputText)
    nuxtApp.vueApp.component("Button", Button)

});