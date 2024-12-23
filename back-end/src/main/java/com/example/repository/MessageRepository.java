package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.entity.*;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByPostedBy(Integer accountId);

    @Query("SELECT m FROM Message m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Message> searchMessagesByTitleIgnoreCase(@Param("query") String query);
}
