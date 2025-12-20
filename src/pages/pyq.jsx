import { useState, useEffect } from 'react'
import '../App.css'
import Data from '../jee_mains_clean.json'
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

function PYQ() {

    const renderQuestion = (text) => {
        const parts = text.split('$$');

        return parts.map((part, index) => {

            if (index % 2 === 0) {
                return (
                    <span
                        key={index}
                        dangerouslySetInnerHTML={{ __html: part }}
                    />
                );
            } 

            return <BlockMath key={index} math={part} />;
        });
    }

    function fixLatex(text) {
        if (!text) return text;

        return text
            .replace(
                /\\buildrel\s*\{([^}]*)\}\s*\\over\s*\\longrightarrow/g,
                '\\xrightarrow{$1}'
            )
            .replace(
                /\\mathrel\s*\{\\mathop\{\\kern0pt\\longrightarrow\}\\limits_\{([^}]*)\}\^\{([^}]*)\}\}/g,
                '\\xrightarrow[$1]{$2}'
            );
    }

    const [data, setData] = useState([]);
    const [currIndex, setcurrIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);


    const getData = async () => {
        try {
            setData(Data);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setSelectedOption(null);
        setShowResult(false);
    }, [currIndex]);

    return (
        <>
            <div className='bg-[#15191E] text-white w-full min-h-screen h-full'>
                {data.length > 0 ? (() => {
                    const currVal = data[currIndex];
                    const currOptions = currVal.options;


                    const prev = () => {
                        setcurrIndex((prev) => Math.max(prev - 1, 0))
                    }

                    const next = () => {
                        setcurrIndex((prev) => Math.min(prev + 1, data.length - 1));
                    }

                    const sub = () => {
                        setShowResult(true);
                    }


                    return (
                        <>
                            <div className='flex justify-center text-center font-bold'>
                                <p className='mt-10'>JEE MAINS - {currVal.chapter}</p>
                            </div>

                            <div className="bg-[#272E36] rounded-xl p-6 m-5 mx-auto w-[70%] mt-10 ">
                                <div className='flex justify-between font-medium opacity-75'>
                                    <p>Question {currIndex + 1}</p>
                                    <p>JEE Main 2024 (09 Apr Shift 2)</p>
                                </div>
                                <div className='font-bold mt-5 leading-7'>{renderQuestion(fixLatex(currVal.question))}</div>

                            </div>

                            <div className="grid grid-cols-2 gap-4 w-[70%] mx-auto">
                                {currOptions.map((opt, i) => {
                                    let border = "border-1"
                                    let bg = "bg-[#272E36]";
                                    if (showResult) {
                                        if (i === currVal.correct_option_index) {
                                            border = "border-2 border-green-500";
                                            bg = "bg-green-800";
                                        } else if (i === selectedOption) {
                                            border = "border-2 border-red-500";
                                            bg = "bg-red-800";
                                        }
                                    } else if (i === selectedOption) {
                                        border = "border-2 border-[#3DBBF4]";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedOption(i)}
                                            className={`${border} ${bg} rounded-xl p-6 min-h-20`}
                                        >
                                            {renderQuestion(fixLatex(opt.content))}
                                        </button>
                                    );
                                })}
                            </div>


                            <div className='h-60 bg-[#15191E] '></div>
                            <div className="fixed bottom-0 left-0 right-0 bg-[#15191E] py-5">
                                <div className="mx-auto w-[70%] flex justify-around ">
                                    <button className="border border-white px-12 py-4 rounded-lg font-semibold" disabled={currIndex === 0} onClick={prev}>PREVIOUS</button>
                                    <button className="bg-[#3DBBF4] px-20 py-4 rounded-lg font-bold" onClick={sub}>SUBMIT</button>
                                    <button className="border border-white px-12 py-4 rounded-lg font-semibold " disabled={currIndex === data.length - 1} onClick={next}>NEXT</button>
                                </div>
                            </div>
                        </>
                    );
                })() : <p>Data not found</p>}


            </div>

        </>
    )
}

export default PYQ;
