import { saveAnswers } from "~/store/save-db"; 
import { loadAnswers } from "~/store/load-db"; 
import { component$, useOnWindow, $ } from '@builder.io/qwik';

import { useLocalStorage } from "~/hooks/useLocalStorage";

 
export default component$(() => {
    const [checkedItems] = useLocalStorage('PSC_PROGRESS', {});
    useOnWindow('load', $(() => {
      saveAnswers(checkedItems.value);
      loadAnswers();
    }));
 
  return (
    "Hello"
  );
});