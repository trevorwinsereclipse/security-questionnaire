import { component$, useContextProvider, Slot } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";
import jsyaml from "js-yaml";

import Navbar from "~/components/furniture/nav";
import Footer from "~/components/furniture/footer";
import { ChecklistContext } from "~/store/checklist-context";
// import { useChecklist } from "~/store/local-checklist-store";
import type { Sections } from "~/types/PSC";

export const useChecklists = routeLoader$(async () => {
  const localURL = 'http://localhost:5173/personal-security-checklist.yml'
  // const remoteUrl = 'https://raw.githubusercontent.com/trevorwinsereclipse/security-questionnaire/main/personal-security-checklist.yml';
  return fetch(localURL)
    .then((res) => res.text())
    .then((res) => jsyaml.load(res) as Sections);
});

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export default component$(() => {
  const checklists = useChecklists();
  console.log(checklists);
  useContextProvider(ChecklistContext, checklists);

  return (
    <>
      <Navbar />
      <main class="bg-base-100 min-h-full">
        <Slot />
      </main>
      <Footer />
    </>
  );
});
