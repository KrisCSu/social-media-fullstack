package com.example.entity;

import javax.persistence.*;

@Entity
@Table(name = "messageLike")
public class MessageLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "messageLikeId")
    private Integer messageLikeId;

    @Column(name = "messageId", nullable = false)
    private Integer messageId;

    @Column(name = "likedBy", nullable = false)
    private Integer likedBy;

    @Column(name = "timePostedEpoch", nullable = false)
    private Long timePostedEpoch;

    // Default constructor
    public MessageLike() {
    }

    // Constructor without ID for new entries
    public MessageLike(Integer messageId, Integer likedBy, Long timePostedEpoch) {
        this.messageId = messageId;
        this.likedBy = likedBy;
        this.timePostedEpoch = timePostedEpoch;
    }

    // Constructor with all fields
    public MessageLike(Integer messageLikeId, Integer messageId, Integer likedBy, Long timePostedEpoch) {
        this.messageLikeId = messageLikeId;
        this.messageId = messageId;
        this.likedBy = likedBy;
        this.timePostedEpoch = timePostedEpoch;
    }

    // Getters and Setters
    public Integer getMessageLikeId() {
        return messageLikeId;
    }

    public void setMessageLikeId(Integer messageLikeId) {
        this.messageLikeId = messageLikeId;
    }

    public Integer getMessageId() {
        return messageId;
    }

    public void setMessageId(Integer messageId) {
        this.messageId = messageId;
    }

    public Integer getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(Integer likedBy) {
        this.likedBy = likedBy;
    }

    public Long getTimePostedEpoch() {
        return timePostedEpoch;
    }

    public void setTimePostedEpoch(Long timePostedEpoch) {
        this.timePostedEpoch = timePostedEpoch;
    }

    // Equals and hashCode for comparison
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        MessageLike that = (MessageLike) o;

        if (!messageLikeId.equals(that.messageLikeId))
            return false;
        if (!messageId.equals(that.messageId))
            return false;
        if (!likedBy.equals(that.likedBy))
            return false;
        return timePostedEpoch.equals(that.timePostedEpoch);
    }

    @Override
    public int hashCode() {
        int result = messageLikeId.hashCode();
        result = 31 * result + messageId.hashCode();
        result = 31 * result + likedBy.hashCode();
        result = 31 * result + timePostedEpoch.hashCode();
        return result;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "MessageLike{" +
                "messageLikeId=" + messageLikeId +
                ", messageId=" + messageId +
                ", likedBy=" + likedBy +
                ", timePostedEpoch=" + timePostedEpoch +
                '}';
    }
}