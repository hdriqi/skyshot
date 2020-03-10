import Head from 'next/head'

const Layout = ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel='icon' href={`/icon.png`} />
      <meta charSet="utf-8" />
      <link href={`/fonts/inter.css`} rel="stylesheet"></link>
			<link href={`/tailwind.min.css`} rel="stylesheet"></link>
      <title>Skyshot - Free web screenshot powered by Sia</title>
      <meta name="description" content="Screen capture webpage free stored on decentralized storage system powered by Sia." />
      <style>
        {
          `
          body {
            font-family: "Inter", sans-serif;
          }
          
          button:disabled {
            opacity: 25%;
          }
          `
        }
      </style>
    </Head>
		{ children }
  </div>
)

export default Layout