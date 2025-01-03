package com.example.service;

import com.example.entity.Follow;
import com.example.repository.FollowRepository;
import com.example.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    @Transactional
    public Follow followUser(String token, Follow follow) {
        validateTokenAndExtractUsername(token);
        if (follow.getFollowerId() == null || follow.getFolloweeId() == null) {
            throw new IllegalArgumentException("Follower ID and Followee ID cannot be null");
        }
        if (follow.getFollowerId().equals(follow.getFolloweeId())) {
            throw new IllegalArgumentException("A user cannot follow themselves");
        }

        if (followRepository.existsByFollowerIdAndFolloweeId(follow.getFollowerId(), follow.getFolloweeId())) {
            throw new IllegalArgumentException("Already following this user");
        }

        follow.setFollowTimeEpoch(System.currentTimeMillis() / 1000); // 这里设置时间戳
        return followRepository.save(follow);
    }

    @Transactional
    public void unfollowUser(String token, Integer followerId, Integer followeeId) {
        validateTokenAndExtractUsername(token);
        if (!followRepository.existsByFollowerIdAndFolloweeId(followerId, followeeId)) {
            throw new IllegalArgumentException("Not following this user.");
        }
        followRepository.deleteByFollowerIdAndFolloweeId(followerId, followeeId);
    }

    @Transactional(readOnly = true)
    public List<Follow> getFollowing(Integer followerId) {
        return followRepository.findByFollowerId(followerId);
    }

    @Transactional(readOnly = true)
    public List<Follow> getFollowers(Integer followeeId) {
        return followRepository.findByFolloweeId(followeeId);
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(String token, Integer followerId, Integer followeeId) {
        validateTokenAndExtractUsername(token);
        return followRepository.existsByFollowerIdAndFolloweeId(followerId, followeeId);
    }

    @Transactional(readOnly = true)
    public Follow getFollowDetails(Integer followerId, Integer followeeId) {
        List<Follow> follows = followRepository.findByFollowerIdAndFolloweeId(followerId, followeeId);
        if (!follows.isEmpty()) {
            Follow follow = follows.get(0);
            return follow;
        }
        throw new IllegalArgumentException("No follow record found.");
    }

    private String validateTokenAndExtractUsername(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired token.");
        }
        return jwtUtil.extractUsername(token);
    }
}