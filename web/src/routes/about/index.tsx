import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// import Icon from "~/components/core/icon";
import { intro, eclipse_license, original_license } from './about-content';
// import { marked } from "marked";

export default component$(() => {

  // interface Contributor {
  //   login: string;
  //   avatar_url: string;
  //   avatarUrl: string;
  //   html_url: string;
  //   contributions: number;
  //   name: string;
  // }

  // const parseMarkdown = (text: string | undefined): string => {
  //   return marked.parse(text || '', { async: false }) as string || '';
  // };

  // const contributorsResource = useResource$<Contributor[]>(async () => {
  //   const url = 'https://api.github.com/repos/lissy93/personal-security-checklist/contributors?per_page=100';
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch contributors');
  //   }
  //   return await response.json();
  // });

  // const sponsorsResource = useResource$<Contributor[]>(async () => {
  //   const url = 'https://github-sponsors.as93.workers.dev/lissy93';
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch sponsors');
  //   }
  //   return await response.json();
  // });


  return (
    <div class="m-4 md:mx-16">
      <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">About the Security Checklist</h2>
        {intro.map((paragraph, index) => (
          <p class="mb-2" key={index}>{paragraph}</p>
        ))}        
      </article>
      {/* <div class="divider"></div> */}

      {/* <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">Contributing</h2>
        {contributing.map((paragraph, index) => (
          <p class="mb-2" key={index} dangerouslySetInnerHTML={parseMarkdown(paragraph)}></p>
        ))}        
      </article> */}
      <div class="divider"></div>

      <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">Acknowledgments</h2>
        <p>The original work this website is based on was produced by <a href="https://aliciasykes.com" class="link link-primary">Alicia Sykes</a>. If you wish to find out more about her project, follow the link <a href="https://digital-defense.io/" class="link link-primary">here</a>.</p>

      </article>
      <div class="divider"></div>

      {/* <article class="bg-back p-8 mx-auto max-w-[1200px] my-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2" id="author">About the Author</h2>
          <p>
            This project was originally started by
            me, <a href="https://aliciasykes.com" class="link link-primary">Alicia Sykes</a>
            - with a lot of help from the community.
          </p>
          <br />
          <div class="ml-4 float-right">
            <img class="rounded-lg" width="180" height="240" alt="Alicia Sykes" src="https://i.ibb.co/fq10qhL/DSC-0597.jpg" />
            <div class="flex gap-2 my-2 justify-between">
              {
                socials.map((social, index) => (
                  <a key={index} href={social.link}>
                    <Icon icon={social.icon} width={24} height={24} />
                  </a>
                ))
              }
            </div>
          </div>
          <p class="text-lg italic font-thin">
            I write apps which aim to help people <b>escape big tech, secure their data, and protect their privacy</b>.
          </p>
          <br />
          <p>
            I have a particular interest in self-hosting, Linux, security and OSINT.<br />
            So if this type of stuff interests you, check out these other projects:
          </p>
          <ul class="list-disc pl-8">
            {
              projects.map((project, index) => (
                <li key={index}>
                  <img class="rounded inline mr-1" width="20" height="20" alt={project.title} src={project.icon} />
                  <a href={project.link} class="link link-secondary" target="_blank" rel="noreferrer">
                    {project.title}
                  </a> - {project.description}
                </li>
              ))
            }
          </ul>
          <br />
          <p>
            For a more open source apps I've published,
            see <a href="https://apps.aliciasykes.com/" class="link link-primary">apps.aliciasykes.com</a>,
            or <a href="https://github.com/lissy93" class="link link-primary">follow me on GitHub</a>
          </p>

      </article>

      <div class="divider"></div> */}

      <article class="bg-back p-8 mx-auto max-w-[1200px] m-8 rounded-lg shadow-md">
        <h2 class="text-3xl mb-2">License</h2>
        <p>
          This project is licensed
          under <b><a href="https://gist.github.com/Lissy93/143d2ee01ccc5c052a17">MIT</a></b>.
        </p>
        <pre class="bg-front whitespace-break-spaces rounded text-xs my-2 mx-auto p-2">
          {eclipse_license}
        </pre>
        <details class="collapse">
          <summary class="collapse-title">
            <h3 class="mt-2">Original License</h3>
          </summary>
          <div class="collapse-content">
            <pre class="bg-front whitespace-break-spaces rounded text-xs my-2 mx-auto p-2">
              {original_license}
            </pre>
          </div>
        </details>

      </article>

    </div>
  );
});

export const head: DocumentHead = {
  title: "About | Digital Defense",
  meta: [
    {
      name: "description",
      content: "This project aims to give you practical guidance on how to improve your digital security, and protect your privacy online",
    },
  ],
};
