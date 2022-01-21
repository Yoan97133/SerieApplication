package fr.formation.open.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Saison.
 */
@Entity
@Table(name = "saison")
public class Saison implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "number")
    private Integer number;

    @OneToMany(mappedBy = "saison")
    @JsonIgnoreProperties(value = { "saison" }, allowSetters = true)
    private Set<Serie> series = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "saisons" }, allowSetters = true)
    private Episode episode;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Saison id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return this.number;
    }

    public Saison number(Integer number) {
        this.setNumber(number);
        return this;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Set<Serie> getSeries() {
        return this.series;
    }

    public void setSeries(Set<Serie> series) {
        if (this.series != null) {
            this.series.forEach(i -> i.setSaison(null));
        }
        if (series != null) {
            series.forEach(i -> i.setSaison(this));
        }
        this.series = series;
    }

    public Saison series(Set<Serie> series) {
        this.setSeries(series);
        return this;
    }

    public Saison addSerie(Serie serie) {
        this.series.add(serie);
        serie.setSaison(this);
        return this;
    }

    public Saison removeSerie(Serie serie) {
        this.series.remove(serie);
        serie.setSaison(null);
        return this;
    }

    public Episode getEpisode() {
        return this.episode;
    }

    public void setEpisode(Episode episode) {
        this.episode = episode;
    }

    public Saison episode(Episode episode) {
        this.setEpisode(episode);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Saison)) {
            return false;
        }
        return id != null && id.equals(((Saison) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Saison{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            "}";
    }
}
