import { $, component$, useStore, useSignal } from "@builder.io/qwik";
import Icon from "~/components/core/icon";
import type { Priority, Section, Checklist } from '../../types/PSC';
import { marked } from "marked";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import styles from './psc.module.css';

export default component$((props: { section: Section }) => {

  const [completed, setCompleted] = useLocalStorage('PSC_PROGRESS', {});
  const [ignored, setIgnored] = useLocalStorage('PSC_IGNORED', {});
  const [progressScore, setProgressScore] = useLocalStorage('PSC_PROGRESS_SCORE', 0);

  const sortState = useStore({ column: '', ascending: true });
  const checklist = useSignal<Checklist[]>(props.section.checklist);

  const originalFilters = {
    show: 'all',
    levels: {
      essential: true,
      optional: true,
      advanced: true,
      completed: true,
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
  const isIgnored = (pointId: string) => {
    return ignored.value[pointId] || false;
  };

  const isChecked = (pointId: string, column: number) => {
    return completed.value[pointId] && completed.value[pointId] === column;
  };

  const handleCheckboxClick = $((pointId: string, column: number) => {
    const data = { ...completed.value };

    if (data[pointId] === column) {
      delete data[pointId];
    } else {
      data[pointId] = column;
    }
    setCompleted(data);
  });

  const filteredChecklist = checklist.value.filter((item) => {
    const itemId = generateId(item.point);
    const itemCompleted = Object.keys(completed.value).includes(itemId);
    const itemLevel = item.priority;

    if (filterState.show === 'remaining' && itemCompleted) return false;
    if (filterState.show === 'completed' && !itemCompleted) return false;

    return filterState.levels[itemLevel.toLocaleLowerCase() as Priority];
  });

  const sortChecklist = (a: Checklist, b: Checklist) => {
    const getValue = (item: Checklist) => {
      switch (sortState.column) {
        case 'done':
          return Object.keys(completed.value).includes(generateId(item.point)) ? 0 : 1;
        case 'topic':
          return item.point;
        case 'level':
          return ['essential', 'optional', 'advanced', 'completed'].indexOf(item.priority.toLowerCase());
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
    if (sortState.column === column) {
      sortState.ascending = !sortState.ascending;
    } else {
      sortState.column = column;
      sortState.ascending = true;
    }
  });

  const calculateProgress = (): { done: number, total: number, percent: number, disabled: number, score: number } => {
    let done = 0;
    let disabled = 0;
    let total = 0;
    let score = 0;
  
    props.section.checklist.forEach((item) => {
      const itemId = generateId(item.point);
      if (isIgnored(itemId)) {
        disabled += 1;
        done += 1;
      } else if (Object.keys(completed.value).includes(itemId)) {
        done += 1;
        switch (completed.value[itemId]) {
          case 1:
            score += 1;
            break;
          case 2:
            score += 0.5;
            break;
          case 3:
            score += 0;
            break;
        }
      }
      total += 1;
    });
  
    const percent = Math.round((done / total) * 100);
    return { done, total: props.section.checklist.length, percent, disabled, score };
  };
  

  const { done, total, percent, disabled, score } = calculateProgress();
  return (
    <>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <progress class="progress w-64" value={percent} max="100"></progress>
          <p class="text-xs text-center">
            {done} out of {total} ({percent}%)
            complete, {disabled} ignored</p>
          <p class="text-xs text-center">
            Progress Score: {progressScore.value.toFixed(2)}</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Always</th>
            <th>Sometimes</th>
            <th>Never</th>
            <th>Ignore</th>
            <th
              class="cursor-pointer"
              onClick$={() => handleSort('topic')}
            >
              <span class="flex items-center gap-0.5 hover:text-primary transition">
                <Icon width={12} height={14} icon="sort" />
                Topic
              </span>
            </th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredChecklist.sort(sortChecklist).map((item, index) => {
            const badgeColor = getBadgeClass(item.priority);
            const itemId = generateId(item.point);
            const isItemCompleted = Object.keys(completed.value).includes(itemId);
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
                    id={`done-${itemId}-1`}
                    checked={isChecked(itemId, 1)}
                    disabled={isIgnored(itemId)}
                    onClick$={() => {
                      handleCheckboxClick(itemId, 1);
                      setProgressScore(score);
                    }}
                  />
                </td>
                <td class="text-center">
                  <input
                    type="checkbox"
                    class={`checkbox checked:checkbox-${badgeColor} hover:checkbox-${badgeColor}`}
                    id={`done-${itemId}-2`}
                    checked={isChecked(itemId, 2)}
                    disabled={isIgnored(itemId)}
                    onClick$={() => {
                      handleCheckboxClick(itemId, 2);
                      setProgressScore(score);
                    }}
                  />
                </td>
                <td class="text-center">
                  <input
                    type="checkbox"
                    class={`checkbox checked:checkbox-${badgeColor} hover:checkbox-${badgeColor}`}
                    id={`done-${itemId}-3`}
                    checked={isChecked(itemId, 3)}
                    disabled={isIgnored(itemId)}
                    onClick$={() => {
                      handleCheckboxClick(itemId, 3);
                      setProgressScore(score);
                    }}
                  />
                </td>
                <td class="text-center">
                  <input
                    type="checkbox"
                    id={`ignore-${itemId}`}
                    class={`toggle toggle-xs toggle-${badgeColor}`}
                    checked={isIgnored(itemId)}
                    onClick$={() => {
                      const ignoredData = ignored.value;
                      ignoredData[itemId] = !ignoredData[itemId];
                      setIgnored(ignoredData);

                      const completedData = completed.value;
                      delete completedData[itemId];
                      setCompleted(completedData);
                      setProgressScore(score);
                      console.log(progressScore);
                      console.log("Score Logged");
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
                <td class={styles.checklistItemDescription} dangerouslySetInnerHTML={parseMarkdown(item.details)}></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  );
});
