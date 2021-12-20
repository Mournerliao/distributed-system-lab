package com.ustc.webmanage.service;
public interface IAccountService  {
    public boolean login(String userName,String userPassword);
    public boolean register(String userName,String userPassword,String userRepassword);


}
