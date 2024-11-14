import React, { useEffect, useState } from 'react';
import './App.css';

function decodeHtmlEntities(str: string) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(str, 'text/html');
	return doc.documentElement.textContent;
}

const testCount = 31;

function App() {
	const [quiz, setQuiz] = useState([] as Record<string, any>);
	const [testId, setTestId] = useState('quiz1');
	const [rightOnly, setRightOnly] = useState(false);
	const [testMode, setTestMode] = useState(true);

	useEffect(() => {
		fetch(`./${testId}.json`).then(async file => {
			const quizArray = await file.json();
			// quizArray.sort(() => Math.random() - 0.5);
			setQuiz(quizArray);
		});
	}, [testId]);

	const listItems = quiz.map((q: any, index: number) => {
		// q.options.sort(() => Math.random() - 0.5);
		let image = null;
		if (q.image) {
			image = q.image.startsWith('http') ? q.image : `https://dmv-test-ru.com${q.image}`;
		}
		return (
			<>
				<p key={q.id} className="question">{index + 1}. {decodeHtmlEntities(q.question)}</p>
				{image &&
					<img
						className="question-img"
						style={{maxHeight: '200px'}}
						src={image}
					/>
				}
				{q.options.map((c: string | { text: string, position: number }) => {
					const text = typeof c === 'string' ? c : c.text;
					const position = typeof c === 'string' ? null : c.position;
					const correct = text === q.correct;
					if (!rightOnly) {
						return (
							<p style={{margin: 0}}>
								<button className="option-div">{decodeHtmlEntities(text)} {correct && '✔'}</button>
							</p>
						);
					}
					if (correct) {
						return (<p style={{margin: 0, fontSize: "13px"}}>
							<button className="option-div" >{decodeHtmlEntities(text)}</button>
						</p>);
					}
					return null;
				})}
			</>
		)
	});

	let links = [];

	for (let i = 1; i <= testCount; i++) {
		links.push(<a href="#" style={{marginRight: "20px"}} onClick={() => setTestId(`quiz${i}`)}>Тест {i}</a>);
	}

	let links2 = [];

	for (let i = 1; i <= 1; i++) {
		links2.push(<a href="#" style={{marginRight: "20px"}} onClick={() => setTestId(`quiz-2-${i}`)}>Тест {i}</a>);
	}

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRightOnly(event.target.checked);
	};

	return (
		<div className="App">
			<header className="App-header">
				Тесты DMV California
			</header>
			<div className="container">
				<div>
					{links}
				</div>
				<div>Перевод</div>
				<div>
					{links2}
				</div>
				<div>
					<label>
						<input type="checkbox" checked={rightOnly} onChange={handleCheckboxChange} />
						Только правильные ответы</label>
				</div>
				<div id="display-container">
					{listItems}
				</div>
				
			</div>
		</div>
	);
}

export default App;
