import { saveAnswers } from "~/store/save-db"; 
import { loadAnswers } from "~/store/load-db"; 
import { component$, useSignal } from '@builder.io/qwik';

import { useLocalStorage } from "~/hooks/useLocalStorage";

 
export default component$(() => {
    const [checkedItems] = useLocalStorage('PSC_PROGRESS', {});
    saveAnswers(checkedItems);
    loadAnswers();
 
  return (
    "Hello"
  );
});