import { $, component$, useStore, useSignal } from "@builder.io/qwik";
import { useCSSTransition } from "qwik-transition";

import Icon from "~/components/core/icon";
import type { Priority, Section, Checklist } from '../../types/PSC';
import { marked } from "marked";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import styles from './psc.module.css';


export default component$((props: { section: Section }) => {

  const [completed, setCompleted] = useLocalStorage('PSC_PROGRESS', {});
  // const [ignored, setIgnored] = useLocalStorage('PSC_IGNORED', {});

  const showFilters = useSignal(false);
  const { stage } = useCSSTransition(showFilters, { timeout: 300 });

  const sortState = useStore({ column: '', ascending: true });

  const checklist = useSignal<Checklist[]>(props.section.checklist);

  const originalFilters = {
    show: 'all', // 'all', 'remaining', 'completed'
    levels: {
      essential: true,
      optional: true,
      advanced: true,
    },
  };

  const filterState = useStore(originalFilters);

  const getBadgeClass = (priority: Priority, precedeClass: string = '') => {
    switch (priority.toLocaleLowerCase()) {
      case 'essential':
        return `${precedeClass}success`;
      case 'optional':
        return `${precedeClass}warning`;
      case 'advanced':
        return `${precedeClass}error`;
      default:
        return `${precedeClass}neutral`;
    }
  };

  const generateId = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-');
  };

  const parseMarkdown = (text: string | undefined): string => {
    return marked.parse(text || '', { async: false }) as string || '';
  };

  // Ignore feature removed (all statements must be answered)
  // const isIgnored = (pointId: string) => {
  //   return ignored.value[pointId] || false;
  // };
  

  const isChecked = (pointId: string) => {
    // if (isIgnored(pointId)) return false;
    return completed.value[pointId] || false;
  };

  const filteredChecklist = checklist.value.filter((item) => {
    const itemId = generateId(item.point);
    const itemCompleted = isChecked(itemId);
    // const itemIgnored = isIgnored(itemId);
    const itemLevel = item.priority;

    // Filter by completion status
    if (filterState.show === 'remaining' && itemCompleted) return false;
    if (filterState.show === 'completed' && !itemCompleted) return false;

    // Filter by level
    return filterState.levels[itemLevel.toLocaleLowerCase() as Priority];
  });

  const sortChecklist = (a: Checklist, b: Checklist) => {
    const getValue = (item: Checklist) => {
      switch (sortState.column) {
        case 'done':
          // if (isIgnored(generateId(item.point))) {
          //   return 2;
          // }
          return isChecked(generateId(item.point)) ? 0 : 1;
        case 'topic':
          return item.point;
        case 'level':
          return ['essential', 'optional', 'advanced'].indexOf(item.priority.toLowerCase());
        default:
          return 0;
      }
    };
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (valueA === valueB) {
      return 0;
    } else if (sortState.ascending) {
      return valueA < valueB ? -1 : 1;
    } else {
      return valueA > valueB ? -1 : 1;
    }
  };

  const handleSort = $((column: string) => {
    if (sortState.column === column) { // Reverse direction if same column
      sortState.ascending = !sortState.ascending;
    } else { // Sort table by column
      sortState.column = column;
      sortState.ascending = true; // Default to ascending
    }
  });

  // Filter feature removed (over-engineered questionnaire) 
  const resetFilters = $(() => {
    checklist.value = props.section.checklist;
    sortState.column = '';
    sortState.ascending = true;
    filterState.levels = originalFilters.levels;
    filterState.show = originalFilters.show;
  });

  const calculateProgress = (): { done: number, total: number, percent: number, disabled: number} => {
    let done = 0;
    let disabled = 0;
    let total = 0;

    props.section.checklist.forEach((item) => {
      const itemId = generateId(item.point);
      if (isChecked(itemId)) {
        done += 1;
        total += 1;
      } else {
        total += 1;
      }
    });

    const percent = Math.round((done / total) * 100);
    return { done, total: props.section.checklist.length, percent, disabled };
  };

  const { done, total, percent, disabled } = calculateProgress();

  return (
    <>

    <div class="flex flex-wrap justify-between items-center">
      <div>
        <progress class="progress w-64" value={percent} max="100"></progress>
        <p class="text-xs text-center">
          {done} out of {total} ({percent}%)
          complete</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          { [
            { id: 'done', text: 'Done?'},
            { id: 'topic', text: 'Topic' }
          ].map((item) => (
            <th
              key={item.id}
              class="cursor-pointer"
              onClick$={() => handleSort(item.id)}
            >
              <span class="flex items-center gap-0.5 hover:text-primary transition">
                <Icon width={12} height={14} icon="sort" />
                {item.text}
              </span>
            </th>
          ))}
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {filteredChecklist.sort(sortChecklist).map((item, index) => {
          const badgeColor = getBadgeClass(item.priority);
          const itemId = generateId(item.point);
          const isItemCompleted = isChecked(itemId);
          return (
            <tr key={index} class={[
              'rounded-sm transition-all',
              isItemCompleted ? `bg-${badgeColor} bg-opacity-10` : '',
              !isItemCompleted ? `hover:bg-opacity-5 hover:bg-${badgeColor}` : '',
              ]}>
              <td class="text-center">
                <input
                  type="checkbox"
                  class={`checkbox checked:checkbox-${badgeColor} hover:checkbox-${badgeColor}`}
                  id={`done-${itemId}`}
                  checked={isChecked(itemId)}
                  onClick$={() => {
                    const data = completed.value;
                    data[itemId] = !data[itemId];
                    setCompleted(data);
                  }}
                />
              </td>
              <td>
                <label
                  for={`done-${itemId}`}
                  class={"text-base font-bold cursor-pointer"}>
                  {item.point}
                </label>
              </td>
              {/* <td>
                <div class={`badge gap-2 badge-${badgeColor}`}>
                  {item.priority}
                </div>
              </td> */}
              <td class={styles.checklistItemDescription} dangerouslySetInnerHTML={parseMarkdown(item.details)}></td>
            </tr>
          )}
        )}
      </tbody>
    </table>
    </>
  );
});
