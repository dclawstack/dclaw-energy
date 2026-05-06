import random
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class CreateReportRequest(BaseModel):
    facility_id: str
    period: str


class EnergyReport(BaseModel):
    id: str
    facility_id: str
    period: str
    total_kwh: int
    peak_hours: list[str]
    wastage_estimate: str
    savings_opportunities: list[str]
    created_at: str


class HourlyData(BaseModel):
    hour: str
    kwh: int


@router.post("/reports")
async def create_report(req: CreateReportRequest) -> EnergyReport:
    return EnergyReport(
        id=str(uuid.uuid4()),
        facility_id=req.facility_id,
        period=req.period,
        total_kwh=random.randint(500, 50000),
        peak_hours=["14:00-16:00"],
        wastage_estimate="12% HVAC overnight",
        savings_opportunities=["LED retrofit"],
        created_at=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    )


@router.get("/reports/{report_id}/breakdown")
async def get_report_breakdown(report_id: str) -> list[HourlyData]:
    return [
        HourlyData(hour="08:00", kwh=random.randint(200, 800)),
        HourlyData(hour="10:00", kwh=random.randint(400, 1200)),
        HourlyData(hour="12:00", kwh=random.randint(600, 1500)),
        HourlyData(hour="14:00", kwh=random.randint(800, 1800)),
        HourlyData(hour="16:00", kwh=random.randint(600, 1400)),
        HourlyData(hour="18:00", kwh=random.randint(400, 1000)),
        HourlyData(hour="20:00", kwh=random.randint(300, 900)),
        HourlyData(hour="22:00", kwh=random.randint(200, 700)),
    ]
