import React from 'react';
import './NewUpdateAvailable.scss';
import TaskFlowDiagram from 'assets/images/taskFlowDiagram.jpg';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import packageJson from '../../../../package.json';

function NewUpdateAvailable() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type: 'APP_VERSION_CHANGE',
            payload: packageJson.version,
        });
    }, []);

    return (
        <div className='p-2'>
            <div className='update_section'>
                <p className='date_title'>21 July 2022 </p>

                <div className='update_container'>
                    <p>In Beta version 0.3.4:</p>
                    <ul>
                        <li>Bug fixes.</li>
                    </ul>
                </div>
            </div>
            <div className='update_section'>
                <p className='date_title'>24 June 2022 </p>

                <div className='update_container'>
                    <p>In Beta version 0.3.3:</p>
                    <ul>
                        <li>Bug fixes.</li>
                    </ul>
                </div>
            </div>

            <div className='update_section'>
                <p className='date_title'>20 June 2022 </p>

                <div className='update_container'>
                    <p>
                        In Beta version 0.3.2 Some new features has been added:
                    </p>
                    <ul>
                        <li>Bug fixes.</li>
                        <li>
                            <span className='highlightText'>New feature:</span>{' '}
                            You can find all the bugs related to the task by
                            tapping on{' '}
                            <span className='highlightText'>Review Failed</span>
                            .{' '}
                        </li>
                    </ul>
                </div>
            </div>
            <div className='update_section'>
                <p className='date_title'>16 June 2022 </p>

                <div className='update_container'>
                    <p>
                        In Beta version 0.3.1 Some new features has been added:
                    </p>
                    <ul>
                        <li>Notification has been implemented.</li>
                        <li>
                            Three new status added in task:-
                            <ul className='pl-4'>
                                <li>
                                    <span className='highlightText'>
                                        Waiting For Review
                                    </span>{' '}
                                    :If any task's been completed then Status
                                    changes to Waiting For Review.
                                </li>
                                <li>
                                    <span className='highlightText'>
                                        Under Review
                                    </span>{' '}
                                    :- QA or any team member will be change the
                                    status Waiting For Review to Under Review
                                    for Testing and then Completed.
                                </li>
                                <li>
                                    <span className='highlightText'>
                                        {' '}
                                        Review Failed{' '}
                                    </span>
                                    :- If any Bug is Create related to any task
                                    then Task status will be Review Failed.
                                </li>
                            </ul>
                        </li>
                        <li>
                            For more reference checkout task flow diagram{' '}
                            <span className='cursorPointer'>
                                <a
                                    href='/main/new_updates'
                                    onClick={() => {
                                        window.open(TaskFlowDiagram, '_blank');
                                    }}
                                >
                                    (Click to see)
                                </a>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default NewUpdateAvailable;
