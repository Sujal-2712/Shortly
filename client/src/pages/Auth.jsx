import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../components/ui/tabs";
import Login from "./../components/Login";
import Signup from './../components/Signup';

const Auth = () => {
  const [isCreated, setIsCreated] = useState(false);
  const [selectedTab, setSelectedTab] = useState('login');
  useEffect(() => {
    if (isCreated) {
      setSelectedTab('login');
    }
  }, [isCreated]);

  return (
    <div className="flex flex-col h-fit items-center mt-20 md:mt-10">
      <div className="w-[85%] md:w-[30%] h-auto mt-10">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full " value="login">Sign In</TabsTrigger>
            <TabsTrigger className="w-full" value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup setIsCreated={setIsCreated} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
