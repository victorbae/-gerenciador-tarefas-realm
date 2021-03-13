import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import { getRealmApp } from "../getRealmApp";
import { Task, User } from "../schemas";
import { ObjectId } from "bson";
import BcryptReactNative from 'bcrypt-react-native';


// Access the Realm App.
const app = getRealmApp();

// Create a new Context object that will be provided to descendants of
// the AuthProvider.
const AuthContext = React.createContext(null);

// The AuthProvider is responsible for user management and provides the
// AuthContext value to its descendants. Components under an AuthProvider can
// use the useAuth() hook to access the auth value.
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(app.currentUser || null);
  const realmRef = useRef(null);
  const [partition, setPartition] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    // The current user always has their own project, so we don't need
    // to wait for the user object to load before displaying that project.
    setPartition(`project=${user.id}`);
    const config = {
      schema: [Task, User],
      sync: {
        user: user,
        partitionValue: `user=${user.id}`,
      },
    };

    console.log("[AuthProvider] ...aguardando conexão -> " + `user=${user.id}`);
    Realm.App.Sync.setLogLevel(app, "debug");
    // Open a realm with the logged in user's partition value in order
    // to get the projects that the logged in user is a member of
    Realm.open(config).then((userRealm) => {
      realmRef.current = userRealm;
      console.log("[AuthProvider] Conectado Realm ->" + userRealm);
    });

    return () => {
      // cleanup function
      const userRealm = realmRef.current;
      if (userRealm) {
        userRealm.close();
        realmRef.current = null;
        setPartition(null); // set project data to an empty array (this prevents the array from staying in state on logout)
      }
    };
  }, [user, partition]);

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  const signIn = async (email, password, callback) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds);
    setUser(newUser);
  
    if (user) {
      callback();
    }
  };

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  const signUp = async (email, password) => {
    const userRealm = realmRef.current;
    // await app.emailPasswordAuth.registerUser(email, password);
    const salt = await BcryptReactNative.getSalt(6);
    const pwd = await BcryptReactNative.hash(salt, "senha");
    const _id = new ObjectId();
    userRealm.write(() => {
      userRealm.create(
        "User",
        {
          _id: _id,
          _partition: `user=${_id}`,
          email: email,
          password: pwd
        }
      );
    });
    console.log("É pra ter salvado ...");
  };

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = () => {
    if (user == null) {
      console.warn("Not logged in, can't log out!");
      return;
    }
    user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        user,
        partition, // list of projects the user is a memberOf
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// The useAuth hook can be used by components under an AuthProvider to
// access the auth context value.
const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error("useAuth() called outside of a AuthProvider?");
  }
  return auth;
};

export { AuthProvider, useAuth };