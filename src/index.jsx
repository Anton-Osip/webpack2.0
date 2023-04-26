import './styles/styles.css'
import './styles/scss.scss'
import React from 'react'

const App = () => (
	<div className='container'>
		<h2>
			Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus quisquam voluptatibus magni
			consequuntur, similique ducimus excepturi reprehenderit totam quae, repellendus fugiat beatae
			laboriosam, doloremque itaque numquam magnam possimus minus quod!
		</h2>
	</div>
)

import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App tab='home' />)
