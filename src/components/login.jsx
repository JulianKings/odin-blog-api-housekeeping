/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import useMultiRefs from '../scripts/helper/helper';
import '../style/login.css';
import useMergedRef from '@react-hook/merged-ref';
import { useNavigate } from 'react-router-dom';

function Login()
{
    const [inputs, addInput] = useMultiRefs();
    const navigate = useNavigate();

    // password lock management
    const passwordLock = useRef(null);
    const passwordInput = useRef(null);

    const multiPasswordRef = useMergedRef(passwordInput, addInput);

    useEffect(() => {
        if(localStorage.getItem('sso_token'))
        {
            navigate('/');
        }

        const inputElements = inputs();
        inputElements.forEach((input) => {
            // register all Handlers
            if(input.getAttribute('data-change-event') !== 'true')
            {
                input.addEventListener("change", (event) => {
                    onInputChange(event, input, input.parentElement.nextElementSibling);
                });
                input.setAttribute('data-change-event', 'true');
            }
        });

        // password handler
        if(passwordInput.current)
        {
            if(passwordInput.current.getAttribute('data-change-fast-event') !== 'true')
            {
                passwordInput.current.addEventListener('input', (event) => {
                    onFastInputChange(event, passwordInput.current, passwordInput.current.parentElement.nextElementSibling);
                });

                passwordInput.current.addEventListener('propertychange', (event) => {
                    onFastInputChange(event, passwordInput.current, passwordInput.current.parentElement.nextElementSibling);
                    }); // for IE8
                
                    passwordInput.current.setAttribute('data-change-fast-event', 'true');
            }
        }    
          
        // register lock status handler
        if(passwordLock.current.getAttribute('data-event-click') !== 'true')
        {
            passwordLock.current.addEventListener('click', () => {
                swapLock();
                passwordInput.current.setAttribute("type", (passwordInput.current.getAttribute('type') === 'text') ? "password" : "text");
            });
            
            passwordLock.current.setAttribute('data-event-click', 'true');
        }
    }, []);

    return <>
        <main className='login-box-container'>
            <div className='login-box'>
                <div className='login-box-title'>Sign in</div>
                <form method="post" onSubmit={submitLogin}>
                <div className="form-row">
                        <div className="form-input">
                            <div className="form-input-label"><label htmlFor="userName">User Name</label></div>
                            <div className="form-input-content"><input ref={addInput} type="text" id="userName" name="user_name" minLength="3" maxLength="12" required /></div>
                            <div className="form-input-error"></div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-input">
                            <div className="form-input-label"><label htmlFor="password">Password</label></div>
                            <div className="form-input-content">
                                <input ref={multiPasswordRef} type="password" id="password" name="user_password" required minLength="6" maxLength="32" />
                                <div id="formPasswordLock" ref={passwordLock}></div>
                            </div>
                            <div className="form-input-error"></div>
                        </div>
                    </div>
                    <div className='form-row'>
                        <button type='submit'>Sign in</button>
                    </div>
                </form>
            </div>
        </main>
    </>

    function submitLogin(event)
    {
        event.preventDefault();
        const user = {};
        let errorNoticed = false;
        const inputElements = inputs();

        inputElements.forEach((input) => {
            if(input.classList.contains('error'))
            {
                errorNoticed = true;
            } else {
                user[input.id] = input.value;
            }
        });

        if(!errorNoticed)
        {
            // ask the backEnd
            fetch("http://localhost:3000/login", { 
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                mode: "cors",
                dataType: 'json',
                body: JSON.stringify(user),
            })
            .then((response) => {
            if (response.status >= 400) {
                throw new Error("server error");
            }
            return response.json();
            })
            .then((response) => {
                if(response.responseStatus)
                {
                    if(response.responseStatus === 'validLogin')
                    {
                        // Do JWT stuff
                        localStorage.setItem('sso_token', response.token);
                        navigate(0);
                    } else {
                        console.log(response.errors);
                        response.errors.forEach((error) => {
                            const result = inputElements.find((input) => {
                                if(input.id === error.path)
                                {
                                    return input;
                                }
                            })

                            if(result)
                            {                    
                                if(result.classList.contains("valid"))
                                {
                                    result.classList.remove("valid");
                                }       
                                result.classList.add("error");
                                result.parentElement.nextElementSibling.textContent = error.msg;
                            }
                        });
                    }
                }            
            })
            .catch((error) => {
                throw new Error(error);
            });
        }
    }

    function onInputChange(inputEvent, input, prevSibling)
    {
        //clean up
        if(input.classList.contains("error"))
        {
            input.classList.remove("error");
            // cleanup error notif
            prevSibling.textContent = "";
        }

        if(input.classList.contains("valid"))
        {
            input.classList.remove("valid");
        }
    }

    function onFastInputChange(inputEvent, input, prevSibling)
    {
        let inputValue = inputEvent.target.value;
        // apply/remove required flag
        if(input.getAttribute("required") !== null && inputValue !== undefined 
        && inputValue !== "")
        {
            input.setAttribute("wasRequired", true);
            input.removeAttribute("required");
        } else if(input.getAttribute("wasRequired") !== null && inputValue === undefined ||
        input.getAttribute("wasRequired") !== null && inputValue === "")
        {
            input.setAttribute("required", "");
            input.removeAttribute("wasRequired");

            // cleanup errors since its empty
            if(input.classList.contains("error"))
            {
                input.classList.remove("error");
                prevSibling.textContent = "";
            }

            cleanUpLock();
        }    

        if(inputValue !== "" && inputValue !== undefined)
        {
            enableLock();
        }
                
    }

    // password lock helpers
    function cleanUpLock()
    {
        if(passwordLock.current.classList.contains("form-input-password-lock"))
        {
            passwordLock.current.classList.remove("form-input-password-lock");
        }

        if(passwordLock.current.classList.contains("form-input-password-lock-disabled"))
        {
            passwordLock.current.classList.remove("form-input-password-lock-disabled");
        }

        if(passwordLock.current.classList.contains("form-input-password-lock-2"))
        {
            passwordLock.current.classList.remove("form-input-password-lock-2");
        }

        if(passwordLock.current.classList.contains("form-input-password-lock-disabled-2"))
        {
            passwordLock.current.classList.remove("form-input-password-lock-disabled-2");
        }
    }

    function swapLock()
    {
        if(passwordLock.current.classList.contains("form-input-password-lock"))
        {
            passwordLock.current.classList.remove("form-input-password-lock");
            passwordLock.current.classList.add("form-input-password-lock-disabled");
        } else if(passwordLock.current.classList.contains("form-input-password-lock-disabled"))
        {
            passwordLock.current.classList.remove("form-input-password-lock-disabled");
            passwordLock.current.classList.add("form-input-password-lock");
        } else if(passwordLock.current.classList.contains("form-input-password-lock-2"))
        {
            passwordLock.current.classList.remove("form-input-password-lock-2");
            passwordLock.current.classList.add("form-input-password-lock-disabled-2");
        } else if(passwordLock.current.classList.contains("form-input-password-lock-disabled-2"))
        {
            passwordLock.current.classList.remove("form-input-password-lock-disabled-2");
            passwordLock.current.classList.add("form-input-password-lock-2");
        }
    }

    function enableLock()
    {
        if((passwordInput.current.getAttribute('type') === 'password'))
        {
            if(!passwordLock.current.classList.contains("form-input-password-lock"))
            {
                passwordLock.current.classList.add("form-input-password-lock");
            }
        } else {
            if(!passwordLock.current.classList.contains("form-input-password-lock-disabled"))
            {
                passwordLock.current.classList.add("form-input-password-lock-disabled");
            }
        }
    }
}

export default Login