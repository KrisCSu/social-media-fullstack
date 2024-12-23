package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name = "follows")
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "followId")
    private Integer followId;

    @Column(name = "followerId", nullable = false)
    private Integer followerId;

    @Column(name = "followeeId", nullable = false)
    private Integer followeeId;

    @Column(name = "followTimeEpoch", nullable = false)
    private Long followTimeEpoch;

    public Follow() {
    }

    public Follow(Integer followerId, Integer followeeId) {
        this.followerId = followerId;
        this.followeeId = followeeId;
    }

    public Follow(Integer followerId, Integer followeeId, Long followTimeEpoch) {
        this.followerId = followerId;
        this.followeeId = followeeId;
        this.followTimeEpoch = followTimeEpoch;
    }

    public Integer getFollowId() {
        return followId;
    }

    public void setFollowId(Integer followId) {
        this.followId = followId;
    }

    public Integer getFollowerId() {
        return followerId;
    }

    public void setFollowerId(Integer followerId) {
        this.followerId = followerId;
    }

    public Integer getFolloweeId() {
        return followeeId;
    }

    public void setFolloweeId(Integer followeeId) {
        this.followeeId = followeeId;
    }

    public Long getFollowTimeEpoch() {
        return followTimeEpoch;
    }

    public void setFollowTimeEpoch(Long followTimeEpoch) {
        this.followTimeEpoch = followTimeEpoch;
    }

    @Override
    public String toString() {
        return "Follow{" +
                "followId=" + followId +
                ", followerId=" + followerId +
                ", followeeId=" + followeeId +
                ", followTimeEpoch=" + followTimeEpoch +
                '}';
    }
}