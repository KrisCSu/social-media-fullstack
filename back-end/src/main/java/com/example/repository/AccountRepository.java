package com.example.repository;

import com.example.entity.*;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<Account, Integer>{
    Optional<Account> findByUsername(String username);
    Optional<Account> findByUsernameAndPassword(String username, String password);
    // Case-insensitive search
    @Query("SELECT a FROM Account a WHERE LOWER(a.username) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Account> searchAccountsByUsernameIgnoreCase(@Param("query") String query);
}
