package com.carrot.mattro.domain.entity;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@Getter
@Document(collection = "subway")
@Data
public class Subway {
    @Id
    private String id;
    private String 역명;
    private double 위도;
    private double 경도;
}
