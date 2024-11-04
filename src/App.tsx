import React, { useState } from 'react';
import StartButton from './components/StartButton/StartButton';
import AccordionContainer from './components/Accordion/AccordionContainer';
import SelectionsContainer from './components/Selections/SelectionsContainer';
import CategoriesContainer from './components/CategorySelect/CategoriesContainer';
import TimingsContainer from './components/Timings/TimingsContainer';
import TrainingModal from './components/TrainingModal/TrainingModal';
import { UserSelectionsContextType, TimingsContextType } from './components/Definitions';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

export const UserSelectionsContext = React.createContext<UserSelectionsContextType | null>(null);
export const TimingsContext = React.createContext<TimingsContextType | null>(null);

function App() {
	const [ stimulusCategory, setStimulusCategory ] = useState("Visual");
	const [ userSelectionsMap, setUserSelectionsMap ] = useState(new Map<string, string[]>());
	const [ duration, setDuration ] = useState(300);
	const [ frequency, setFrequency ] = useState(5);
    const [ isTrainingModeActive, setIsTrainingModeActive ] = useState(false);

	return (
		<div className="App">
			<div className="Website-Header">
				<span>Reaction Cue Trainer</span>
			</div>
			<div className='Two-Column-Container'>
				<div className="Column Category-Accordion-Container">
					<CategoriesContainer stimulusCategory={ stimulusCategory } setStimulusCategory={ setStimulusCategory }/>
					<UserSelectionsContext.Provider value={{ userSelectionsMap, setUserSelectionsMap }}>
						<AccordionContainer stimulusCategory={ stimulusCategory }/>
					</UserSelectionsContext.Provider>
				</div>
				<div className="Column Selections-Timings-Start-Container">
					<SelectionsContainer userSelectionsMap={ userSelectionsMap }/>
					<TimingsContext.Provider value={{ duration, setDuration, frequency, setFrequency }}>
						<TimingsContainer/>
					</TimingsContext.Provider>
					<StartButton 
                        duration={ duration } 
                        frequency={ frequency } 
                        isUserSelectionsMapEmpty={ userSelectionsMap.size === 0 } 
                        isTrainingModeActive={ isTrainingModeActive } 
                        setIsTrainingModeActive={ setIsTrainingModeActive }/>
				</div>
			</div>
            <AnimatePresence>
                { 
                    isTrainingModeActive && (<motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        > 
                            <TrainingModal 
                                userSelectionsMap={ userSelectionsMap } 
                                duration={ duration } 
                                frequency={ frequency } 
                                isTrainingModeActive={ isTrainingModeActive } 
                                setIsTrainingModeActive={ setIsTrainingModeActive }/>
                        </motion.div>)
                }
            </AnimatePresence>

		</div>
	);
}

export default App;