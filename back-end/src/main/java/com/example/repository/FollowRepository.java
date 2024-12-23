package com.example.repository;

import com.example.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Integer> {
    List<Follow> findByFollowerId(Integer followerId);

    List<Follow> findByFolloweeId(Integer followeeId);

    void deleteByFollowerIdAndFolloweeId(Integer followerId, Integer followeeId);

    boolean existsByFollowerIdAndFolloweeId(Integer followerId, Integer followeeId);

    @Query("SELECT f FROM Follow f WHERE f.followerId = ?1 AND f.followeeId = ?2")
    List<Follow> findByFollowerIdAndFolloweeId(Integer followerId, Integer followeeId);
}