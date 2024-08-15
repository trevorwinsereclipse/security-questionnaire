import { saveAnswers } from '~/server/save-db'
import { loadAnswers } from '~/server/load-db'
import { component$, useOnWindow, $ } from '@builder.io/qwik';
import { useLocalStorage } from '~/hooks/useLocalStorage';


export default component$(() => {
    const [checkedItems] = useLocalStorage('PSC_PROGRESS', {});
    useOnWindow('load', $(() => {
      saveAnswers(checkedItems.value);
      loadAnswers();
    }));

    return "Hello";
});
