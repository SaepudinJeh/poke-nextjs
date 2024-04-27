"use client";

import { ENV } from "@/libs/constants/env.constants";
import useStorage from "@/libs/hooks/session.hook";
import useAxios from "axios-hooks";
import { createContext, useState, useContext, useMemo, useEffect } from "react";
import Swal from "sweetalert2";

interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  login: (username: string) => {},
  logout() {},
  user: null,
});

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { getItem } = useStorage();

  const [user, setUser] = useState<string | null>(
    getItem("credential") ?? null
  );

  const [{ data, error }, executePut] = useAxios(
    {
      baseURL: `${ENV.BASE_URL}/my-deck`,
      method: "POST"
    },
    { manual: true }
  );

  const login = (username: string) => {
    setUser(username);
    executePut();
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("credential")
  };
  
// handle modal credential   
  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "Need Credential!",
        text: "Please Enter Your Username!",
        icon: "error",
        allowOutsideClick: false
      }).then((action) => {
        if (action.isConfirmed) {
          let nameInput: HTMLInputElement;
          Swal.fire({
            title: "Login With Username",
            html: `<input type="text" id="name" class="swal2-input" placeholder="Username...">`,
            confirmButtonText: "Login",
            focusConfirm: false,
            allowOutsideClick: false,
            didOpen: () => {
              const popup = Swal.getPopup()!;
              nameInput = popup.querySelector("#name") as HTMLInputElement;
              nameInput.onkeyup = (event) =>
                event.key === "Enter" && Swal.clickConfirm();
            },
            preConfirm: () => {
              const name = nameInput.value;
              if (!name) {
                Swal.showValidationMessage(`Please enter username!`);
              }
              
              try {       
                executePut({data: { username: name }}).then((data) => {
                    if (data?.status === 200) {
                      // Close the modal upon successful login
                      setUser(name);
                      sessionStorage.setItem('credential', data?.data?.data?.username)
                      return true;
                    } else {
                      throw new Error('Login failed');
                    }
                })
              } catch (error) {
                console.error('Error:', error);
                Swal.showValidationMessage(`Login failed. Please try again.`);
                return false;
              }
                
            },
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                showConfirmButton: false,
                timer: 1500 // Close success message after 1.5 seconds
              });
            }
          });
        }
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
